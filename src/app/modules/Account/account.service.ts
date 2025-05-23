import { TBankAccount } from "./account.interface";
import { AccountModel } from "./account.model";
import { generateSavingAccountNumber } from "./account.utils";

const createAccount = async (payload: TBankAccount) => {
//   const accountNumber = await generateSavingAccountNumber(payload);
//   console.log(accountNumber);
//   payload.accountNumber = accountNumber
  const result = await AccountModel.create(payload);
  return result;
};

const getAccounts = async () => {
  const result = await AccountModel.find();
  return result;
};

export const accountServices = {
  createAccount,
  getAccounts,
};
