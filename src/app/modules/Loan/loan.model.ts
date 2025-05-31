import { Schema, model } from "mongoose";
import { TLoan } from "./loan.interface";

const loanSchema = new Schema<TLoan>(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account" },
    accountNumber: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    loanAmount: { type: Number, required: true },
    interestRate: { type: Number, default: 0.1 },
    term: { type: Number }, // e.g., months
    startDate: { type: Date },
    endDate: { type: Date },
    remainingBalance: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "paid"],
      default: "pending",
    },
    repaymentSchedule: {
      dueDate: { type: Date, default: null },
      amountDue: { type: Number, default: 0 },
      paid: { type: Boolean, default: false },
      paidDate: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  },
);

export const LoanModel = model<TLoan>("Loan", loanSchema);
