/* eslint-disable @typescript-eslint/no-unused-vars */
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TBankAccount } from "./account.interface";
import { AccountModel } from "./account.model";
import { generateSavingAccountNumber } from "./account.utils";
import { BranchModel } from "../Branches/branch.model";
import { ACCOUNT_TYPE, TJwtUser } from "../../interface/global";
import QueryBuilder from "../../builder/QueryBuilder";
import { searchAccount } from "./account.const";
import { sendEmail } from "../../utils/sendEmail";

const createAccount = async (user: TJwtUser, payload: TBankAccount) => {
  const isBranchExist = await BranchModel.findById(payload?.branch);
  if (!isBranchExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The branch is not found");
  }

  const isUserExist = await User.findById(user?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const isAccountExist = await AccountModel.findOne({ user: isUserExist._id });
  if (isAccountExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "The user already have an account",
    );
  }

  payload.branchCode = isBranchExist?.code;
  const accountNumber = await generateSavingAccountNumber(payload);
  payload.accountNumber = accountNumber;
  payload.user = isUserExist._id;
  payload.accountHolderName = `${isUserExist.name?.firstName} ${isUserExist.name?.lastName}`;
  payload.currency = "BDT";
  payload.balance = 2000;
  payload.minimumBalance = 2000;

  const result = await AccountModel.create(payload);
  if (result) {
    const subject = `EasyBank ~ Congratulations !! ${result.accountHolderName}`;
    const html = `Your Easy Bank Account Number is <h3>${result.accountNumber}</h3> From now you can do Transactions By this Number. <h4>Don't share it to anyone</h4>`;
    const confirmAccountMail = await sendEmail(
      isUserExist.email,
      subject,
      html,
    );
    console.log(confirmAccountMail);
  }
  return result;
};

const getAccounts = async (query: Record<string, unknown>) => {
  const accountQuery = new QueryBuilder(
    AccountModel.find().populate("user branch"),
    query,
  )
    .search(searchAccount)
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await accountQuery.countTotal();
  const result = await accountQuery.modelQuery;
  return { meta, result };
};

const getMyAccount = async (user: TJwtUser) => {
  const account = await AccountModel.findOne({ user: user?.user });
  if (!account) {
    throw new AppError(HttpStatus.NOT_FOUND, "You dont have an account");
  }
  return account;
};

const getEachAccount = async (id: string, user: TJwtUser) => {
  const account = await AccountModel.findById(id).populate("user branch");
  if (!account) {
    throw new AppError(HttpStatus.NOT_FOUND, "Account not found");
  }

  if (["admin", "manager"].includes(user.role)) {
    return account;
  }
  if (account.user._id.toString() === user?.user.toString()) {
    return account;
  }
  throw new AppError(
    HttpStatus.FORBIDDEN,
    "You are not authorized to access this account",
  );
};

const updateAccount = async (id: string, payload: Partial<TBankAccount>) => {
  const isAccountExist = await AccountModel.findById(id);
  if (!isAccountExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The account is not found");
  }
  const isUserExist = await User.findById(isAccountExist?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The User is not found");
  }

  // Remove immutable fields from payload
  const { accountType, branchCode, accountNumber, ...updateData } = payload;

  // Validate balance requirements
  if (
    updateData.balance &&
    Number(updateData.balance) < Number(isAccountExist.minimumBalance)
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You must maintain a minimum balance of ${isAccountExist.minimumBalance} in your account`,
    );
  }

  if (
    updateData.minimumBalance &&
    Number(updateData.minimumBalance) < Number(isAccountExist.minimumBalance)
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `Minimum balance cannot be lower than ${isAccountExist.minimumBalance}`,
    );
  }

  const result = await AccountModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  return result;
};

const updateAccountStatusOrInterest = async (
  id: string,
  payload: Partial<{
    status: "active" | "closed" | "suspended";
    interestRate: number;
  }>,
) => {
  const isAccountExist = await AccountModel.findOne({ accountNumber: id });
  if (!isAccountExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The account is not found");
  }
  const isUserExist = await User.findById(isAccountExist?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The User is not found");
  }
  const isBranchExist = await BranchModel.findById(isAccountExist?.branch);
  if (!isBranchExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The branch is not found");
  }

  const result = await AccountModel.findOneAndUpdate(
    { accountNumber: id },
    {
      status: payload.status && payload.status,
      interestRate: payload.interestRate && payload.interestRate,
    },
    { new: true },
  );
  return result;
};

const deleteAccount = async (id: string) => {
  const isAccountExist = await AccountModel.findById(id);
  if (!isAccountExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The account is not found");
  }
  if (isAccountExist?.isDeleted) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "The account is already deleted",
    );
  }

  const result = await AccountModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const accountServices = {
  createAccount,
  getAccounts,
  getEachAccount,
  updateAccount,
  updateAccountStatusOrInterest,
  deleteAccount,
  getMyAccount,
};
