import bcrypt from "bcrypt";
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";

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

const refreshToken = async (token: string) => {
  // check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  const { userId, iat } = decoded;
  const user = await User.isUserExistByCustomId(userId);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is not exist");
  }
  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is deleted");
  }
  // checking if the user is already blocked
  if (user?.status === "blocked") {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is blocked");
  }

  if (
    user.passwordChangeAt &&
    User.isJwtIssuedBeforePasswordChange(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(HttpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
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

const forgetPassword = async (id: string) => {
  const user = await User.isUserExistByCustomId(id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is not exist");
  }
  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is deleted");
  }
  // checking if the user is already blocked
  if (user?.status === "blocked") {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is blocked");
  }

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m",
  );

  const resetUiLink = `${config.reset_pass_ui_link}?id=${user?.id}&token=${resetToken}`;
  const userEmail = user?.email;
  sendEmail(userEmail, resetUiLink);
  console.log(resetUiLink);
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
};
