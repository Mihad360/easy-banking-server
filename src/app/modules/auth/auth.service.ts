import bcrypt from "bcrypt";
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistByCustomId(payload.id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User in not exist");
  }
  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is deleted");
  }
  // checking if the user is already blocked
  if (user.status === "blocked") {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is blocked");
  }
  // checking the password are matching or not
  if (!(await User.UserPassword(payload?.password, user?.password))) {
    throw new AppError(HttpStatus.FORBIDDEN, "Password did not matched");
  }
  // create token and send to the client
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "1h",
  });
  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const userData = await User.isUserExistByCustomId(user.userId);
  if (!userData) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User in not exist");
  }
  // checking if the user is already deleted
  if (userData?.isDeleted) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is deleted");
  }
  // checking if the user is already blocked
  if (userData.status === "blocked") {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is blocked");
  }
  // checking the password are matching or not
  if (!(await User.UserPassword(payload?.oldPassword, userData?.password))) {
    throw new AppError(HttpStatus.FORBIDDEN, "Password did not matched");
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findOneAndUpdate(
    {
      id: user.userId,
      role: user.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );
  return result;
};

export const AuthServices = {
  loginUser,
  changePassword,
};
