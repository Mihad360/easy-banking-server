import { model, Schema } from "mongoose";
import { TBankAccount } from "./account.interface";

const accountSchema = new Schema<TBankAccount>(
  {
    accountNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    accountType: {
      type: String,
      enum: ["savings", "checking", "business"],
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "closed", "suspended"],
      required: true,
    },
    branchCode: { type: String },
    accountHolderName: { type: String, required: true },
    interestRate: { type: Number },
    transactions: [{ type: String }],
    minimumBalance: { type: Number },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Model
export const AccountModel = model<TBankAccount>("Account", accountSchema);
