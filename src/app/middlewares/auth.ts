import HttpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../erros/AppError";
import { verifyToken } from "../modules/Auth/auth.utils";
import config from "../config";

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "You are not authorized");
    }
    // verify token -----
    const decoded = verifyToken(token, config.jwt_access_secret as string)
    console.log(decoded)
    next();
  });
};

export default auth;
