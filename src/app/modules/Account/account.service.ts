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

const createAccount = async (user: TJwtUser, payload: TBankAccount) => {
  console.log(user);
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

  const accountNumber = await generateSavingAccountNumber(payload);
  payload.accountNumber = accountNumber;
  payload.user = isUserExist._id;
  payload.accountHolderName = `${isUserExist.name?.firstName} ${isUserExist.name?.lastName}`;
  payload.currency = "BDT";
  payload.balance = 2000;
  payload.minimumBalance = 2000;

  const result = await AccountModel.create(payload);
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

const getEachAccount = async (id: string, user: TJwtUser) => {
  const account = await AccountModel.findById(id).populate("user branch");
  if (!account) {
    throw new AppError(HttpStatus.NOT_FOUND, "Account not found");
  }

  if (["admin", "manager"].includes(user.role)) {
    return account;
  }
  if (account.user._id.toString() === user.user) {
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

  let accountTp;
  const accountNumber = isAccountExist?.accountNumber;
  if (payload.accountType && accountNumber) {
    accountTp = accountNumber.substring(4, 7);
    if (payload.accountType === "savings") {
      accountTp = ACCOUNT_TYPE.savings;
    } else if (payload.accountType === "checking") {
      accountTp = ACCOUNT_TYPE.checking;
    } else if (payload.accountType === "business") {
      accountTp = ACCOUNT_TYPE.business;
    } else {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Please enter a valid account type",
      );
    }
  }

  let newAccountNumber;
  if (
    !payload.accountType ||
    payload.accountType === isAccountExist.accountType
  ) {
    newAccountNumber = isAccountExist?.accountNumber;
  } else if (
    payload.accountType &&
    payload.accountType !== isAccountExist.accountType
  ) {
    newAccountNumber = `${accountNumber.substring(0, 4)}${accountTp}${accountNumber.substring(7, 15)}`;
  }

  // let branch;
  if (payload.branchCode && payload.branchCode !== isAccountExist.branchCode) {
    newAccountNumber = `${newAccountNumber?.substring(0, 2)}${payload.branchCode}${newAccountNumber?.substring(4, 15)}`;
  } else {
    // eslint-disable-next-line no-self-assign
    newAccountNumber = newAccountNumber;
  }

  if (
    payload.balance &&
    Number(payload.balance) < Number(isAccountExist.minimumBalance)
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You must have a balance of ${isAccountExist.minimumBalance} in your account`,
    );
  }
  if (
    payload.minimumBalance &&
    Number(payload.minimumBalance) < Number(isAccountExist.minimumBalance)
  ) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You must have a balance of ${isAccountExist.minimumBalance} in your account`,
    );
  }
  const result = await AccountModel.findByIdAndUpdate(
    id,
    { ...payload, accountNumber: newAccountNumber && newAccountNumber },
    {
      new: true,
    },
  );

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
};
