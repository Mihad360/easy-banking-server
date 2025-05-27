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
    managers: [{ type: Schema.Types.ObjectId, ref: "Manager" }],
    services: { type: [String], default: [] },
    openingSchedule: {
      days: { type: [String], required: true },
      openTime: { type: String, required: true },
      closeTime: { type: String, required: true },
      status: { type: String, enum: ["open", "closed"], default: "open" },
    },
    branchOpenedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const BranchModel = model("Branch", branchSchema);
