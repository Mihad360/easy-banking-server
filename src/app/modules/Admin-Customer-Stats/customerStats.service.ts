import HttpStatus from "http-status";
import mongoose, { Types } from "mongoose";
import AppError from "../../erros/AppError";
import { AccountModel } from "../Account/account.model";
import { TJwtUser } from "../../interface/global";

const getCustomerStats = async (user: TJwtUser) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const userId = new Types.ObjectId(user?.user);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const customerStats = await AccountModel.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          // 1. Balance Distribution (Pie Chart)
          balanceDistribution: [
            {
              $group: {
                _id: "$accountType",
                balance: { $sum: "$balance" },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                accountType: "$_id",
                balance: 1,
                count: 1,
                percentage: {
                  $multiply: [
                    { $divide: ["$balance", { $sum: "$balance" }] },
                    100,
                  ],
                },
              },
            },
          ],

          // 2. Monthly Spending (Bar Chart)
          monthlySpending: [
            {
              $lookup: {
                let: { accountNum: "$accountNumber" },
                from: "transactions",
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$account", "$$accountNum"] },
                          { $eq: ["$user", userId] },
                        ],
                      },
                      createdAt: { $gte: oneMonthAgo },
                      transactionType: {
                        $in: [
                          "deposit",
                          "withdraw",
                          "transfer",
                          "loan",
                          "deposit-loan",
                        ],
                      },
                    },
                  },
                ],
                as: "txns",
              },
            },
            { $unwind: "$txns" },
            {
              $group: {
                _id: {
                  month: { $month: "$txns.createdAt" },
                  //   year: { $year: "$txns.createdAt" },
                  type: "$txns.transactionType",
                },
                amount: { $sum: "$txns.amount" },
              },
            },
            {
              $group: {
                _id: "$_id.month",
                transactions: {
                  $push: {
                    type: "$_id.type",
                    amount: "$amount",
                  },
                },
                totalAmount: { $sum: "$amount" },
              },
            },
            {
              $project: {
                month: "$_id",
                transactions: 1,
                totalAmount: 1,
                deposits: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$transactions",
                          as: "txn",
                          cond: { $eq: ["$$txn.type", "deposit"] },
                        },
                      },
                      as: "d",
                      in: "$$d.amount",
                    },
                  },
                },
                withdrawals: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$transactions",
                          as: "txn",
                          cond: { $eq: ["$$txn.type", "withdraw"] },
                        },
                      },
                      as: "w",
                      in: "$$w.amount",
                    },
                  },
                },
                transfers: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$transactions",
                          as: "txn",
                          cond: { $eq: ["$$txn.type", "transfer"] },
                        },
                      },
                      as: "t",
                      in: "$$t.amount",
                    },
                  },
                },
                loans: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$transactions",
                          as: "txn",
                          cond: { $eq: ["$$txn.type", "loan"] },
                        },
                      },
                      as: "l",
                      in: "$$l.amount",
                    },
                  },
                },
                loanRepayments: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$transactions",
                          as: "txn",
                          cond: { $eq: ["$$txn.type", "deposit-loan"] },
                        },
                      },
                      as: "lr",
                      in: "$$lr.amount",
                    },
                  },
                },
              },
            },
            { $sort: { month: 1 } },
          ],

          //   3. Transaction Frequency (Line Chart)
          transactionFrequency: [
            {
              $lookup: {
                from: "transactions",
                let: { accountNum: "$accountNumber" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$account", "$$accountNum"] },
                      user: userId,
                      createdAt: { $gte: oneMonthAgo },
                    },
                  },
                ],
                as: "txns",
              },
            },
            { $unwind: "$txns" },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$txns.createdAt",
                    },
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.date": 1 } },
            { $limit: 30 },
          ],

          // 4. Loan Progress (Doughnut Chart)
          loanProgress: [
            {
              $lookup: {
                from: "loans",
                let: { accountNum: "$accountNumber" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$accountNumber", "$$accountNum"] },
                      user: userId,
                      status: "active",
                    },
                  },
                ],
                as: "loans",
              },
            },
            { $unwind: "$loans" },
            {
              $project: {
                _id: 0,
                loanAmount: "$loans.loanAmount",
                paid: {
                  $subtract: ["$loans.loanAmount", "$loans.remainingBalance"],
                },
                remaining: "$loans.remainingBalance",
                status: 1,
                nextPaymentDate: {
                  $arrayElemAt: ["$loans.repaymentSchedule.dueDate", 0],
                },
              },
            },
          ],

          // 5. Recent Transactions (Table)
          recentTransactions: [
            {
              $lookup: {
                from: "transactions",
                let: { accountNum: "$accountNumber" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$account", "$$accountNum"] },
                      user: userId,
                      createdAt: { $gte: oneMonthAgo },
                    },
                  },
                  { $sort: { createdAt: -1 } },
                  { $limit: 5 },
                ],
                as: "txns",
              },
            },
            { $unwind: "$txns" },
            {
              $project: {
                _id: 0,
                type: "$txns.transactionType",
                amount: "$txns.amount",
                date: "$txns.createdAt",
                description: "$txns.description",
                status: "$txns.status",
              },
            },
          ],
        },
      },
    ]);

    await session.commitTransaction();
    await session.endSession();
    return customerStats;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Customer stats retrieve failed",
    );
  }
};

export const customerStatServices = {
  getCustomerStats,
};
