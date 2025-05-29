import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config";
import { TOtp, TUserInterface, UserModel } from "./user.interface";

const userSchema = new Schema<TUserInterface, UserModel>(
  {
    // customerId: { type: String, unique: true, sparse: true },
    // managerId: { type: String, unique: true, sparse: true },
    // adminId: { type: String, unique: true, sparse: true },
    name: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
    isDeleted: { type: Boolean, default: false },
    profilePhotoUrl: { type: String },
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

const otpSchema = new Schema<TOtp>({
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  name: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String },
  isDeleted: { type: Boolean, default: false },
  profilePhotoUrl: { type: String },
});

export const OtpModel = model<TOtp>("Otp", otpSchema);
