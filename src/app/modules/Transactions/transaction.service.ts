import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { AccountModel } from "../Account/account.model";
import { TTransaction } from "./transaction.interface";
import mongoose from "mongoose";
import { TransactionModel } from "./transaction.model";

const createDeposit = async (payload: TTransaction) => {
  const isAccountExist = await AccountModel.findOne({
    accountNumber: payload.account,
  });

  if (!isAccountExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "The account is invalid or not found",
    );
  }

  if (isAccountExist.status !== "active") {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Your account is not active yet",
    );
  }

  if (payload.amount <= 0) {
    throw new AppError(HttpStatus.BAD_REQUEST, "Please enter a valid amount");
  }

  const newBalance = Number(isAccountExist.balance) + Number(payload.amount);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updateAmount = await AccountModel.findOneAndUpdate(
      {
        accountNumber: payload.account,
      },
      { balance: newBalance },
      { session, new: true },
    );

    if (!updateAmount) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Balance update failed");
    }

    const transactionData = {
      ...payload,
      status: "pending",
      account: isAccountExist._id,
    };

    const createTransaction = await TransactionModel.create([transactionData], {
      session,
    });

    if (!createTransaction) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Transaction creation failed");
    }

    const updateTransactionStatus = await TransactionModel.findByIdAndUpdate(
      createTransaction[0]._id,
      { status: "completed" },
      { session, new: true },
    );

    if (!updateTransactionStatus) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Transaction status update failed",
      );
    }

    await session.commitTransaction();
    return createTransaction;
  } catch (error) {
    console.log("💥 Transaction Error:", error);
    await session.abortTransaction();
    throw new AppError(HttpStatus.BAD_REQUEST, "Transaction Failed");
  } finally {
    await session.endSession();
  }
};

export const transactionServices = {
  createDeposit,
};
