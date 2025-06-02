import bcrypt from "bcrypt";
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import { Types } from "mongoose";
import { sendEmail } from "../../utils/sendEmail";

export interface JwtPayload {
  user: Types.ObjectId; // No undefined allowed
  email: string;
  role: string;
  profilePhotoUrl?: string;
  phoneNumber: string;
}

const loginUser = async (payload: TLoginUser) => {
  let user;
  user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    user = await User.findOne({
      phoneNumber: payload.email,
    });
  }

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The user is already deleted");
  }
  if (!(await User.compareUserPassword(payload.password, user.password))) {
    throw new AppError(HttpStatus.FORBIDDEN, "Password did not matched");
  }

  const userId = user?._id;

  if (!userId) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user id is missing");
  }

  const jwtPayload: JwtPayload = {
    user: userId,
    email: user?.email,
    role: user?.role,
    profilePhotoUrl: user?.profilePhotoUrl,
    phoneNumber: user?.phoneNumber,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  // console.log(decoded)
  let user;
  if (decoded?.role === "admin") {
    user = await User.findOne({ adminId: decoded.user, email: decoded.email });
  } else if (decoded?.role === "manager") {
    user = await User.findOne({
      managerId: decoded.user,
      email: decoded.email,
    });
  } else if (decoded?.role === "customer") {
    user = await User.findOne({
      customerId: decoded.user,
      email: decoded.email,
    });
  }

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The user is already deleted");
  }
  const userId = user._id;

  if (!userId) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user id is missing");
  }

  const jwtPayload: JwtPayload = {
    user: userId,
    email: user.email,
    role: user.role,
    profilePhotoUrl: user?.profilePhotoUrl,
    phoneNumber: user?.phoneNumber,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is not exist");
  }
  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is deleted");
  }

  const userId = user?._id;

  if (!userId) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user id is missing");
  }

  const jwtPayload: JwtPayload = {
    user: userId,
    email: user?.email,
    role: user?.role,
    profilePhotoUrl: user?.profilePhotoUrl,
    phoneNumber: user?.phoneNumber,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m",
  );
  const resetUiLink = `${config.reset_pass_ui_link}?email=${user?.email}&token=${resetToken}`;
  const userEmail = user?.email;
  sendEmail(userEmail, "Forget link", resetUiLink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is not exist");
  }
  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is deleted");
  }

  const decoded = verifyToken(token, config.jwt_access_secret as string);

  if (payload.email !== decoded.email) {
    throw new AppError(HttpStatus.FORBIDDEN, "You are forbidden");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
    },
  );
  return result;
};

export const authServices = {
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
};
