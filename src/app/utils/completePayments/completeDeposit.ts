import HttpStatus from "http-status";
import mongoose from "mongoose";
import { AccountModel } from "../../modules/Account/account.model";
import AppError from "../../erros/AppError";
import { TransactionModel } from "../../modules/Transactions/transaction.model";

export const completeDeposit = async (metaData) => {
//   console.log(metaData);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newBalance = Number(metaData.newBalance);
    const updateAmount = await AccountModel.findOneAndUpdate(
      {
        accountNumber: metaData.accountNumber,
      },
      { balance: newBalance },
      { session, new: true },
    );

    if (!updateAmount) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Balance update failed");
    }

    const updateTransactionStatus = await TransactionModel.findByIdAndUpdate(
      metaData.transactionId,
      { status: "completed" },
      { session, new: true },
    );

    if (!updateTransactionStatus) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Transaction status update failed",
      );
    }
    await AccountModel.findOneAndUpdate(
      { accountNumber: metaData.accountNumber },
      { $push: { transactions: updateTransactionStatus._id } },
      { session, new: true },
    );

    await session.commitTransaction();
    await session.endSession();
    return updateTransactionStatus;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
  }
};
