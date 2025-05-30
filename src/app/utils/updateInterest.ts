import { AccountModel } from "../modules/Account/account.model";
import dayjs from "dayjs";
import { generateTransactionId } from "../modules/Transactions/transaction.utils";
import { TransactionModel } from "../modules/Transactions/transaction.model";
import mongoose from "mongoose";

export const applyMonthlyInterests = async () => {
  const accounts = await AccountModel.find({
    status: "active",
    accountType: "savings",
  });
  const now = new Date();
  for (const account of accounts) {
    const lastApplied = account.lastInterestDate;
    const monthPassed = dayjs(now).diff(dayjs(lastApplied), "month");
    if (monthPassed >= 1) {
      const interestRate = 0.09;
      const monthlyRate = interestRate / 12;
      const interest = Math.ceil(
        Number(account.balance) * Number(monthlyRate) * Number(monthPassed),
      );
      let balance = account.balance as number;
      const newBalance = (balance += interest);
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
          { session },
        );

        const transactionId = await generateTransactionId("interest");
        await TransactionModel.create(
          [
            {
              account: account.accountNumber,
              transaction_Id: transactionId,
              transactionType: "interest",
              status: "completed",
              createdAt: now,
              amount: interest,
              description: `✅ Interest of ${interest} BDT added to account ${account.accountNumber}`,
              user: account.user,
            },
          ],
          { session },
        );

        await session.commitTransaction();
        console.log(
          `✅ Interest of ${interest} BDT added to account ${account.accountNumber}`,
        );
      } catch (err) {
        await session.abortTransaction();
        console.log(err);
      } finally {
        await session.endSession();
      }
    }
  }
};
