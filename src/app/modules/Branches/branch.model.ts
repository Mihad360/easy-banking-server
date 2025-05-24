import { model, Schema } from "mongoose";

const branchSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    contactNumber: { type: [String], required: true },
    email: { type: String },
    managerName: { type: String },
    services: { type: [String], default: [] },
    openingSchedule: {
      days: { type: [String], required: true }, // e.g., ["Sunday", "Monday", ...]
      openTime: { type: String, required: true }, // e.g., "10:00"
      closeTime: { type: String, required: true }, // e.g., "17:00"
      status: { type: String, enum: ["open", "closed"], default: "open" },
    },
  },
  {
    timestamps: true,
  },
);

export const BranchModel = model("Branch", branchSchema);
