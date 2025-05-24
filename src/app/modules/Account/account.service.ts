import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TBankAccount } from "./account.interface";
import { AccountModel } from "./account.model";
import { generateSavingAccountNumber } from "./account.utils";
import { CustomerModel } from "../Customer/customer.model";
import { BranchModel } from "../Branches/branch.model";

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

export const accountServices = {
  createAccount,
  getAccounts,
};
