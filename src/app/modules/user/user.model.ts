/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangeAt: { type: Date },
    role: { type: String, enum: ["admin", "student", "faculty"] },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  const user = this;
  // hashing password----------------------
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await User.findOne({ id }).select("+password");
};

userSchema.statics.UserPassword = async function (
  plainTextPassword,
  hashTextPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashTextPassword);
};

userSchema.statics.isJwtIssuedBeforePasswordChange = async function (
  passwordChangeTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  const passwordChangeTime = new Date(passwordChangeTimeStamp).getTime() / 1000;
  return passwordChangeTime > jwtIssuedTimeStamp;
};

export const User = model<TUser, UserModel>("User", userSchema);
