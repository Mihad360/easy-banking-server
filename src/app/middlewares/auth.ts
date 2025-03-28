import HttpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../erros/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // check if the token sent
    if (!token) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "You are not authorized");
    }
    // check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { role, userId, iat } = decoded;
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
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "You are not authorized");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
