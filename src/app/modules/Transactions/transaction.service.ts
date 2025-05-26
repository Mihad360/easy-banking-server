import { TTransaction } from "./transaction.interface";

const createTransaction = async (payload: TTransaction) => {
  return payload;
};

export const transactionServices = {
  createTransaction,
};
