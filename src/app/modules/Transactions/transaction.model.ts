// models/transaction.model.ts
import { Schema, model } from "mongoose";
import { TTransaction } from "./transaction.interface";

const transactionSchema = new Schema<TTransaction>(
  {
    account: { type: String, ref: "Account" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    transaction_Id: { type: String },
    transactionType: {
      type: String,
      enum: ["deposit", "withdraw", "transfer", "interest"],
      required: true,
    },
    amount: { type: Number, required: true },
    fromAccount: { type: String, ref: "fromAccount" },
    toAccount: { type: String, ref: "toAccount" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    description: { type: String },
  },
  { timestamps: true },
);

export const TransactionModel = model<TTransaction>(
  "Transaction",
  transactionSchema,
);
