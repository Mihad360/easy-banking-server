import HttpStatus from "http-status";
import mongoose, { Types } from "mongoose";
import AppError from "../../erros/AppError";
import { AccountModel } from "../Account/account.model";
import { TJwtUser } from "../../interface/global";

const getCustomerStats = async (user: TJwtUser) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const accountSummery = await AccountModel.aggregate([
      { $match: { user: new Types.ObjectId(user?.user) } },
      {
        $facet: {
          accountOverview: [
            {
              $group: {
                _id: null,
                totalBalance: { $sum: "$balance" },
                accounts: { $push: "$$ROOT" },
              },
            },
            {
              $project: {
                _id: 0,
                totalBalance: 1,
                accountTypes: {
                  $map: {
                    input: "$accounts",
                    as: "acc",
                    in: {
                      type: "$$acc.accountType",
                      balance: "$$acc.balance",
                      accountNumber: "$$acc.accountNumber",
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    await session.commitTransaction();
    await session.endSession();
    return { accountSummery };
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
