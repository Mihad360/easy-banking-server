import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TBankAccount } from "./account.interface";
import { AccountModel } from "./account.model";
import { generateSavingAccountNumber } from "./account.utils";
import { CustomerModel } from "../Customer/customer.model";
import { BranchModel } from "../Branches/branch.model";
import { ACCOUNT_TYPE } from "../../interface/global";

const createAccount = async (payload: TBankAccount) => {
  const isUserExist = await User.findById(payload?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const isCustomerExist = await CustomerModel.findById(payload?.customer);
  if (!isCustomerExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The customer is not found");
  }
  const isBranchExist = await BranchModel.findById(payload?.branch);
  if (!isBranchExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The Branch is not found");
  }
  const accountNumber = await generateSavingAccountNumber(payload);
  payload.accountNumber = accountNumber;
  const result = await AccountModel.create(payload);
  return result;
};

const getAccounts = async () => {
  const result = await AccountModel.find().populate("user customer");
  return result;
};

const updateAccount = async (
  id: string,
  payload: {
    accountHolderName: string;
    accountType: "savings" | "checking" | "business";
  },
) => {
  const isAccountExist = await AccountModel.findById(id);
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

  let accountTp;
  const accountNumber = isAccountExist?.accountNumber;
  if (accountNumber) {
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

  const newAccountNumber = `${accountNumber.substring(0, 4)}${accountTp}${accountNumber.substring(7, 15)}`;

  const result = await AccountModel.findByIdAndUpdate(
    id,
    {
      accountHolderName: payload.accountHolderName,
      accountType: payload.accountType,
      accountNumber: newAccountNumber,
    },
    { new: true },
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
  const isAccountExist = await AccountModel.findById(id);
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

  const result = await AccountModel.findByIdAndUpdate(
    id,
    {
      status: payload.status && payload.status,
      interestRate: payload.interestRate && payload.interestRate,
    },
    { new: true },
  );
  return result;
};

export const accountServices = {
  createAccount,
  getAccounts,
  updateAccount,
  updateAccountStatusOrInterest,
};
