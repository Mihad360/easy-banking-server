import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { AccountModel } from "../Account/account.model";
import { TTransaction } from "./transaction.interface";
import mongoose from "mongoose";
import { TransactionModel } from "./transaction.model";
import { generateTransactionId } from "./transaction.utils";
import { TJwtUser } from "../../interface/global";
import { User } from "../User/user.model";

const createDeposit = async (user: TJwtUser, payload: TTransaction) => {
  let query = {};

  if (user.role === "customer") {
    query = { customerId: user.user };
  } else if (user.role === "manager") {
    query = { managerId: user.user };
  } else if (user.role === "admin") {
    query = { adminId: user.user };
  } else {
    throw new AppError(HttpStatus.BAD_REQUEST, "Invalid user role");
  }

  const isUserExist = await User.findOne(query);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const isAccountExist = await AccountModel.findOne({
    accountNumber: payload.account,
    user: isUserExist?._id,
  });
  if (!isAccountExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "The account Number is invalid or not matching your Identity",
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

    payload.transaction_Id = await generateTransactionId(
      payload.transactionType,
    );
    payload.user = isAccountExist?.user;
    const transactionData = {
      ...payload,
      status: "pending",
      account: payload.account,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.log("💥 Transaction Error:", error);
    await session.abortTransaction();
    throw new AppError(HttpStatus.BAD_REQUEST, "Transaction Failed");
  } finally {
    await session.endSession();
  }
};

const createWithdraw = async (user: TJwtUser, payload: TTransaction) => {
  console.log(user);
  return payload;
};

export const transactionServices = {
  createDeposit,
  createWithdraw,
};
