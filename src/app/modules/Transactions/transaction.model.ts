// models/transaction.model.ts
import { Schema, model } from "mongoose";
import { TTransaction } from "./transaction.interface";

const transactionSchema = new Schema<TTransaction>(
  {
    account: { type: String, ref: "Account" },
    transactionType: {
      type: String,
      enum: ["deposit", "withdraw", "transfer"],
      required: true,
    },
    amount: { type: Number, required: true },
    fromAccount: { type: Schema.Types.ObjectId, ref: "fromAccount" },
    toAccount: { type: Schema.Types.ObjectId, ref: "toAccount" },
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
