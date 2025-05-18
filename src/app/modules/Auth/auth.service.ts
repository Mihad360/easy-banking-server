import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistByEmail(payload.email);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  if (!(await User.compareUserPassword(payload.password, user.password))) {
    throw new AppError(HttpStatus.FORBIDDEN, "Password did not matched");
  }
  return user;
};

export const authServices = {
  loginUser,
};
