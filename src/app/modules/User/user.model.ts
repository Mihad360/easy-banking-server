import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config";
import { TUserInterface, UserModel } from "./user.interface";

const userSchema = new Schema<TUserInterface, UserModel>(
  {
    customerId: { type: String, unique: true, sparse: true },
    managerId: { type: String, unique: true, sparse: true },
    adminId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email });
};

userSchema.statics.compareUserPassword = async function (
  payloadPassword: string,
  hashedPassword: string,
) {
  const compare = await bcrypt.compare(payloadPassword, hashedPassword);
  return compare;
};

export const User = model<TUserInterface, UserModel>("User", userSchema);
