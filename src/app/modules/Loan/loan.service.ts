import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TJwtUser } from "./../../interface/global";
import { TLoan } from "./loan.interface";
import { AccountModel } from "../Account/account.model";
import { BranchModel } from "../Branches/branch.model";
import { LoanModel } from "./loan.model";
import dayjs from "dayjs";

const requestLoan = async (user: TJwtUser, payload: TLoan) => {
//   console.log(user);
  const isUserExist = await User.findById(user?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const isAccountExist = await AccountModel.findOne({ user: isUserExist._id });
  if (!isAccountExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The users Account is not found");
  }
  const isBranchExist = await BranchModel.findById(payload.branch);
  if (!isBranchExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The users Account is not found");
  }

  payload.user = isUserExist._id;
  payload.account = isAccountExist._id;
  payload.accountNumber = isAccountExist.accountNumber;
  const termInMonths = payload.term;
  const endDate = dayjs(payload.startDate)
    .add(termInMonths as number, "month")
    .toDate();
  payload.endDate = endDate;

  const result = await LoanModel.create(payload);
  return result;
};

export const loadServices = {
  requestLoan,
};
