import { AccountModel } from "../modules/Account/account.model";
import dayjs from "dayjs";
import { generateTransactionId } from "../modules/Transactions/transaction.utils";
import { TransactionModel } from "../modules/Transactions/transaction.model";
import mongoose from "mongoose";
import { BranchModel } from "../modules/Branches/branch.model";

export const applyMonthlyInterests = async () => {
  const accounts = await AccountModel.find({
    status: "active",
    accountType: "savings",
  });

  const now = new Date();
  for (const account of accounts) {
    const lastApplied = account.lastInterestDate;
    const yearPassed = dayjs(now).diff(dayjs(lastApplied), "year");
    if (yearPassed >= 1) {
      const interestRate = 0.06;
      const balance = account.balance as number;
      const n = 1;
      const t = yearPassed;

      // Compound interest formula: A = P * (1 + r/n)^(nt)
      const A = balance * Math.pow(1 + interestRate / n, n * t);
      const interest = Math.ceil(A - balance);
      const newBalance = balance + interest;
      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        await AccountModel.findByIdAndUpdate(
          account._id,
          {
            $set: {
              balance: newBalance,
              lastInterestDate: now,
            },
          },
          { session, new: true },
        );

        await BranchModel.findByIdAndUpdate(
          account.branch,
          {
            $inc: {
              reserevedBalance: -interest,
              // usedBalance: interest,
            },
          },
          { session, new: true },
        );

        const transactionId = await generateTransactionId("interest");
        const result = await TransactionModel.create(
          [
            {
              account: account.accountNumber,
              transaction_Id: transactionId,
              transactionType: "interest",
              status: "completed",
              createdAt: now,
              amount: interest,
              description: `✅ ${yearPassed} Years Interest of ${interest} BDT added to account ${account.accountNumber}`,
              user: account.user,
            },
          ],
          { session },
        );

        await session.commitTransaction();
        console.log(
          `✅ ${yearPassed} Years Interest of ${interest} BDT added to account ${account.accountNumber}`,
        );
        return result;
      } catch (err) {
        await session.abortTransaction();
        console.log(err);
      } finally {
        await session.endSession();
      }
    }
  }
};
