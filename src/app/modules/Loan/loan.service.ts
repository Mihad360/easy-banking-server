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
import { TransactionModel } from "../Transactions/transaction.model";
import { generateTransactionId } from "../Transactions/transaction.utils";

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

    const endDate = payload.startDate
      ? dayjs(payload.startDate)
          .add(
            (payload.term as number) || (isLoanExist.term as number),
            "month",
          )
          .endOf("month")
          .toDate()
      : dayjs(isLoanExist.startDate)
          .add(
            (payload.term as number) || (isLoanExist.term as number),
            "month",
          )
          .endOf("month")
          .toDate();
    payload.endDate = endDate;
    payload.remainingBalance = isLoanExist.loanAmount;
    const updateLoan = await LoanModel.findByIdAndUpdate(
      id,
      {
        ...payload,
        startDate:
          payload.startDate && dayjs(payload.startDate).hour(24).toDate(),
        interestRate: payload.interestRate && payload.interestRate,
      },
      { session, new: true },
    );
    if (!updateLoan) {
      throw new AppError(HttpStatus.BAD_REQUEST, "The update is failed");
    }

    if (payload.status === "approved") {
      const isBranchExist = await BranchModel.findOne({
        _id: isLoanExist.branch,
      });
      const newReserveBalance =
        Number(isBranchExist?.reserevedBalance) -
        Number(isLoanExist.loanAmount);
      const newUsedBalance =
        Number(isBranchExist?.usedBalance) + Number(isLoanExist.loanAmount);
      const updateBranchBalance = await BranchModel.findOneAndUpdate(
        {
          _id: isLoanExist.branch,
        },
        {
          reserevedBalance: newReserveBalance && newReserveBalance,
          usedBalance: newUsedBalance && newUsedBalance,
        },
        {
          session,
          new: true,
        },
      );
      if (!updateBranchBalance) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "Branch balance update failed",
        );
      }
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

      const newAccountBalance =
        Number(isAccountExist.balance) +
        Number(updateRepaymentDetails.loanAmount);
      const updateUserAccountBalance = await AccountModel.findOneAndUpdate(
        {
          accountNumber: isLoanExist.accountNumber,
          user: isLoanExist.user,
        },
        {
          balance: newAccountBalance,
        },
        {
          session,
          new: true,
        },
      );
      if (!updateUserAccountBalance) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "Customer account balance update failed",
        );
      }

      const transaction_Id = await generateTransactionId("loan");
      const transaction = {
        account: isLoanExist.accountNumber,
        user: isLoanExist.user,
        transactionType: "loan",
        transaction_Id: transaction_Id,
        status: "completed",
        description: "Loan Approved",
        amount: isLoanExist.loanAmount,
      };
      const createLoanTransaction = await TransactionModel.create(transaction);
      if (!createLoanTransaction) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Transaction create failed");
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

const payLoan = async (id: string, payload: { monthsToPay: number }) => {
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
  const isBranchExist = await BranchModel.findById(isLoanExist?.branch);
  if (!isBranchExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The branch is not found");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const paidBalance =
      (Number(isLoanExist.loanAmount) / Number(isLoanExist.term)) *
      payload.monthsToPay;
    const newUserBalance = Number(isAccountExist.balance) - paidBalance;
    const updateUserAccountBalance = await AccountModel.findByIdAndUpdate(
      isLoanExist.account,
      {
        balance: newUserBalance && newUserBalance,
      },
      { session, new: true },
    );
    if (!updateUserAccountBalance) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "The user balance update failed",
      );
    }

    const newReserveBalance =
      Number(isBranchExist.reserevedBalance) + paidBalance;
    const newUsedBalance = Number(isBranchExist.usedBalance) - paidBalance;

    const updateBranchBalance = await BranchModel.findByIdAndUpdate(
      isLoanExist.branch,
      {
        reserevedBalance: newReserveBalance && newReserveBalance,
        usedBalance: newUsedBalance && newUsedBalance,
      },
      { session, new: true },
    );
    if (!updateBranchBalance) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "The Branch balance update failed",
      );
    }

    const unPaids = isLoanExist.repaymentSchedule?.filter(
      (loan) => loan.paid === false,
    );
    if (!unPaids) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        "Loan is already submitted or not found",
      );
    }
    if (unPaids.length < payload.monthsToPay) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Not enough unpaid months to cover payment",
      );
    }
    const unpaidLoans = isLoanExist.repaymentSchedule;
    if (!unpaidLoans) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        "Something went wrong during finding unpaid loan months",
      );
    }

    let count = 0;
    const updatedSchedule = unpaidLoans.map((item) => {
      if (!item.paid && count < payload.monthsToPay) {
        count++;
        return {
          ...item,
          paid: true,
          paidDate: new Date(),
        };
      }
      return item;
    });
    const updatedPay = await LoanModel.findByIdAndUpdate(
      isLoanExist._id,
      { $set: { repaymentSchedule: updatedSchedule } },
      { session, new: true },
    );

    const transaction_Id = await generateTransactionId("deposit-loan");
    const transaction = {
      account: isLoanExist.accountNumber,
      user: isLoanExist.user,
      transactionType: "deposit-loan",
      transaction_Id: transaction_Id,
      status: "completed",
      description: "Loan Deposit successfull",
      amount: paidBalance,
    };
    const sendTransaction = await TransactionModel.create(transaction);
    if (!sendTransaction) {
      throw new AppError(HttpStatus.NOT_FOUND, "Transaction send failed");
    }

    await session.commitTransaction();
    await session.endSession();
    return updatedPay;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new AppError(HttpStatus.BAD_REQUEST, error as any);
  }
};

export const loadServices = {
  requestLoan,
  updateRequestedLoan,
  payLoan,
};
