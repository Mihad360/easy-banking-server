import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TBankAccount } from "./account.interface";
import { AccountModel } from "./account.model";
import { generateSavingAccountNumber } from "./account.utils";
import { CustomerModel } from "../Customer/customer.model";
import { BranchModel } from "../Branches/branch.model";
import { ACCOUNT_TYPE, TJwtUser } from "../../interface/global";
import { ManagerModel } from "../Manager/manager.model";
import { AdminModel } from "../Admin/admin.model";

const createAccount = async (user: TJwtUser, payload: TBankAccount) => {
  const isBranchExist = await BranchModel.findById(payload?.branch);
  if (!isBranchExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The branch is not found");
  }

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

  let accountId;
  // Check based on user role
  if (isUserExist.role === "customer") {
    accountId = await CustomerModel.findOne({ user: isUserExist._id });
    if (!accountId) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        "Customer profile not found for this user",
      );
    }
    payload.customer = accountId?._id;
  } else if (isUserExist.role === "manager") {
    accountId = await ManagerModel.findOne({ user: isUserExist._id });
    if (!accountId) {
      throw new AppError(HttpStatus.NOT_FOUND, "The manager is not found");
    }
    payload.manager = accountId?._id;
  } else if (isUserExist.role === "admin") {
    accountId = await AdminModel.findOne({ user: isUserExist._id });
    if (!accountId) {
      throw new AppError(HttpStatus.NOT_FOUND, "The admin is not found");
    }
    payload.admin = accountId?._id;
  } else {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "User role not authorized to open account",
    );
  }

  const accountNumber = await generateSavingAccountNumber(payload);
  payload.accountNumber = accountNumber;
  payload.user = isUserExist._id;
  payload.accountHolderName = `${accountId.name?.firstName} ${accountId.name?.lastName}`;
  payload.currency = "BDT";
  payload.balance = 2000;
  payload.interestRate = 3;
  payload.minimumBalance = 2000;

  const result = await AccountModel.create(payload);
  return result;
};

const getAccounts = async () => {
  const result = await AccountModel.find().populate("user customer");
  return result;
};

const getEachAccount = async (id: string) => {
  const result = await AccountModel.findById(id).populate("user customer");
  return result;
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
  const isCustomerExist = await CustomerModel.findById(
    isAccountExist?.customer,
  );
  if (!isCustomerExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The customer is not found");
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
