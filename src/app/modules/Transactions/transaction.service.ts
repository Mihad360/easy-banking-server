import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { AccountModel } from "../Account/account.model";
import { TTransaction } from "./transaction.interface";
import mongoose from "mongoose";
import { TransactionModel } from "./transaction.model";
import { generateTransactionId } from "./transaction.utils";
import { TJwtUser } from "../../interface/global";
import { User } from "../User/user.model";
import { checkUserRole } from "../../utils/checkUserRole";

const createDeposit = async (user: TJwtUser, payload: TTransaction) => {
  // const query = await checkUserRole(user);
  const isUserExist = await User.findById(user?.user);
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
  // const query = await checkUserRole(user);

  const isUserExist = await User.findById(user?.user);
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
  if (Number(payload.amount) > Number(isAccountExist?.balance)) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "You don't have sufficient balance that you want to withdraw",
    );
  }
  const remainingBalance =
    Number(isAccountExist.balance) - Number(payload.amount);
  if (remainingBalance < Number(isAccountExist.minimumBalance)) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You must maintain a minimum balance of ${isAccountExist.minimumBalance} BDT in your account`,
    );
  }

  const newBalance = Number(isAccountExist.balance) - Number(payload.amount);
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

const createTransfer = async (user: TJwtUser, payload: TTransaction) => {
  if (payload.fromAccount === payload.toAccount) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Please enter valid account numbers",
    );
  }
  // const query = await checkUserRole(user);
  const isUserExist = await User.findById(user?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const isFromAccountExist = await AccountModel.findOne({
    accountNumber: payload.fromAccount,
    user: isUserExist?._id,
  });
  if (!isFromAccountExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "Your account Number is invalid or not matching your Identity",
    );
  }
  const isToAccountExist = await AccountModel.findOne({
    accountNumber: payload.toAccount,
  });
  if (!isToAccountExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "The Recievers account Number is invalid or not matching your Identity",
    );
  }

  if (isFromAccountExist.status !== "active") {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Your account is not active yet",
    );
  }
  if (isToAccountExist.status !== "active") {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "The other account is not active yet",
    );
  }

  if (payload.amount <= 0) {
    throw new AppError(HttpStatus.BAD_REQUEST, "Please enter a valid amount");
  }
  if (Number(payload.amount) > Number(isFromAccountExist?.balance)) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "You don't have sufficient balance that you want to transfer",
    );
  }
  const remainingBalance =
    Number(isFromAccountExist.balance) - Number(payload.amount);
  if (remainingBalance < Number(isFromAccountExist.minimumBalance)) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You must maintain a minimum balance of ${isFromAccountExist.minimumBalance} BDT in your account`,
    );
  }
  const newBalance =
    Number(isFromAccountExist.balance) - Number(payload.amount);
  const newToBalance =
    Number(isToAccountExist.balance) + Number(payload.amount);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateAmount = await AccountModel.findOneAndUpdate(
      {
        accountNumber: payload.fromAccount,
      },
      { balance: newBalance },
      { session, new: true },
    );

    if (!updateAmount) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Your Balance update failed");
    }

    const updateTransferedAcc = await AccountModel.findOneAndUpdate(
      {
        accountNumber: payload.toAccount,
      },
      { balance: newToBalance },
      { session, new: true },
    );
    if (!updateTransferedAcc) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Transfered account Balance update failed",
      );
    }

    payload.transaction_Id = await generateTransactionId(
      payload.transactionType,
    );
    payload.user = isFromAccountExist?.user;
    const transactionData = {
      ...payload,
      status: "pending",
      account: payload.fromAccount,
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

const getTransactions = async () => {
  const result = await TransactionModel.find();
  return result;
};

const getPersonalTransactions = async (user: TJwtUser) => {
  const query = await checkUserRole(user);
  const isUserExist = await User.findOne(query);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const isAccountExist = await AccountModel.findOne({ user: isUserExist._id });
  if (!isAccountExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The Account is not found");
  }
  const result = await TransactionModel.find({ user: isAccountExist.user });
  return result;
};

export const transactionServices = {
  createDeposit,
  createWithdraw,
  createTransfer,
  getTransactions,
  getPersonalTransactions,
};
