import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

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
  return {};
};

export const AuthServices = {
  loginUser,
};
