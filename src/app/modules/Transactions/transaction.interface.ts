import { Types } from "mongoose";

export type TTransaction = {
  account?: string;
  user?: Types.ObjectId;
  transaction_Id?: string;
  transactionType:
    | "deposit"
    | "withdraw"
    | "transfer"
    | "interest"
    | "loan"
    | "deposit-loan";
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  status?: "pending" | "completed" | "failed";
  description?: string;
};
