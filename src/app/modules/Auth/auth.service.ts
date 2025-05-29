import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import { Types } from "mongoose";

export interface JwtPayload {
  user: Types.ObjectId; // No undefined allowed
  email: string;
  role: string;
}

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email });
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
  // let userId;
  // if (user?.role === "admin") userId = user.adminId;
  // else if (user?.role === "manager") userId = user.managerId;
  // else if (user?.role === "customer") userId = user.customerId;

  if (!userId) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user id is missing");
  }

  const jwtPayload: JwtPayload = {
    user: userId,
    email: user?.email,
    role: user?.role,
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
const userId = user._id
  // Assign correct ID based on role
  // let userId;
  // if (user.role === "admin") userId = user.adminId;
  // else if (user.role === "manager") userId = user.managerId;
  // else userId = user.customerId;

  if (!userId) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user id is missing");
  }

  const jwtPayload: JwtPayload = {
    user: userId,
    email: user.email,
    role: user.role,
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

export const authServices = {
  loginUser,
  refreshToken,
};
