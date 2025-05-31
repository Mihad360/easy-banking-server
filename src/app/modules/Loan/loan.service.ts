import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TJwtUser } from "./../../interface/global";
import { TLoan } from "./loan.interface";
import { AccountModel } from "../Account/account.model";
import { BranchModel } from "../Branches/branch.model";
import { LoanModel } from "./loan.model";
import dayjs from "dayjs";
import mongoose from "mongoose";

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
    throw new AppError(HttpStatus.NOT_FOUND, "The branch is not found");
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

const updateRequestedLoan = async (id: string, payload: Partial<TLoan>) => {
  const isLoanExist = await LoanModel.findById(id);
  if (!isLoanExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The Loan request is not found");
  }
  const isUserExist = await User.findById(isLoanExist?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const isAccountExist = await AccountModel.findOne({
    user: isLoanExist.user,
    accountNumber: isLoanExist.accountNumber,
  });
  if (!isAccountExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The users Account is not found");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const endDate = dayjs(payload.startDate)
      .add((payload.term as number) || (isLoanExist.term as number), "month")
      .endOf("month")
      .toDate();
    payload.endDate = endDate;
    const updateLoan = await LoanModel.findByIdAndUpdate(
      id,
      {
        ...payload,
        startDate:
          payload.startDate && dayjs(payload.startDate).hour(24).toDate(),
        // endDate:
        //   payload.startDate &&
        //   dayjs(payload.startDate)
        //     .add(Number(payload.term) - 1, "month")
        //     .endOf("month")
        //     .toDate(),
      },
      { session, new: true },
    );
    if (!updateLoan) {
      throw new AppError(HttpStatus.BAD_REQUEST, "The update is failed");
    }

    if (
      updateLoan.status === "approved" &&
      !updateLoan.repaymentSchedule?.length
    ) {
      const monthlyAmount =
        Number(updateLoan.loanAmount) / Number(updateLoan.term);

      const rePaymentDetails = Array.from(
        { length: updateLoan.term as number },
        (_, index) => ({
          dueDate: dayjs(updateLoan.startDate)
            .add(index + 1, "month")
            .hour(24)
            .toDate(),
          amountDue: monthlyAmount,
          paid: false,
          paidDate: null,
        }),
      );

      const updateRepaymentDetails = await LoanModel.findByIdAndUpdate(
        updateLoan._id,
        {
          repaymentSchedule: rePaymentDetails && rePaymentDetails,
        },
        { session, new: true },
      );
      if (!updateRepaymentDetails) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "The Payment schedule update is failed",
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();
    return updateLoan;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new AppError(HttpStatus.BAD_REQUEST, error as any);
  }
};

const updateRePaymentSchedule = async (id: string, payload) => {
  const isLoanExist = await LoanModel.findById(id);
  if (!isLoanExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The Loan request is not found");
  }
  const isUserExist = await User.findById(isLoanExist?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const isAccountExist = await AccountModel.findOne({
    user: isLoanExist.user,
    accountNumber: isLoanExist.accountNumber,
  });
  if (!isAccountExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The users Account is not found");
  }
  return payload;
};

export const loadServices = {
  requestLoan,
  updateRequestedLoan,
  updateRePaymentSchedule,
};
