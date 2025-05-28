import { Types } from "mongoose";

export type TTransaction = {
  account?: string;
  transactionType: "deposit" | "withdraw" | "transfer";
  amount: number;
  fromAccount?: Types.ObjectId;
  toAccount?: Types.ObjectId;
  status?: "pending" | "completed" | "failed";
  description?: string;
};
