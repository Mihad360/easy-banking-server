import { Types } from "mongoose";

export interface TBankAccount {
  accountNumber: string;
  user: Types.ObjectId;
  customer: Types.ObjectId;
  branch: Types.ObjectId;
  accountType: "savings" | "checking" | "business";
  balance: number;
  currency: string;
  status: "active" | "closed" | "suspended";
  branchCode?: string;
  accountHolderName: string;
  interestRate?: number;
  transactions?: string[];
  minimumBalance?: number;
}
