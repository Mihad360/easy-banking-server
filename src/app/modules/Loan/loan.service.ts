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
import { createPayment } from "../../utils/stripePayment";

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
  const isUserHaveLoan = await LoanModel.findOne({
    user: isUserExist._id,
    accountNumber: isAccountExist.accountNumber,
  });
  if (!isUserHaveLoan) {
    throw new AppError(HttpStatus.NOT_FOUND, "Your loan is not found");
  }
  const isLastLoanCompleted = isUserHaveLoan.repaymentSchedule?.filter(
    (loan) => !loan.paid,
  );

  if (isLastLoanCompleted && isLastLoanCompleted?.length > 0) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "You already have an unpaid loan. Please paid this first to get another loan",
    );
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
    const principal = isLoanExist.loanAmount;
    const rate = isLoanExist.interestRate as number;
    const totalPayable =
      principal + (principal * rate * Number(isLoanExist.term)) / 100;
    payload.remainingBalance = totalPayable;
    
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
      const loanAmount = Number(updateLoan.loanAmount);
      const term = Number(updateLoan.term);
      const interestRate = Number(updateLoan.interestRate);
      let remainingPrincipal = loanAmount;
      const rePaymentDetails = [];
      for (let i = 0; i < term; i++) {
        const interestThisMonth = remainingPrincipal * interestRate;
        const principalThisMonth = loanAmount / term;
        const totalDue = principalThisMonth + interestThisMonth;

        rePaymentDetails.push({
          dueDate: dayjs(updateLoan.startDate)
            .add(i + 1, "month")
            .hour(24)
            .toDate(),
          amountDue: Math.ceil(totalDue),
          paid: false,
          paidDate: null,
        });

        remainingPrincipal -= principalThisMonth;
      }

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

const payLoan = async (
  id: string,
  payload: { transactionType: string; monthsToPay: number },
) => {
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

    const rePaymentDetails = isLoanExist.repaymentSchedule?.filter(
      (month) => !month.paid,
    );
    if (!rePaymentDetails) {
      throw new AppError(HttpStatus.NOT_FOUND, "Payment schedule not found");
    }
    if (payload.monthsToPay > rePaymentDetails.length) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        `You only have ${rePaymentDetails.length} unpaid months left.`,
      );
    }

    const paidBalance =
      rePaymentDetails &&
      rePaymentDetails
        .slice(0, payload.monthsToPay)
        .reduce((sum, month) => sum + month.amountDue, 0);

    if (!paidBalance) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        "The repayment schedule not found",
      );
    }
    // const paidBalance =
    //   (Number(isLoanExist.loanAmount) / Number(isLoanExist.term)) *
    //   payload.monthsToPay;

    const newUserBalance = Number(isAccountExist.balance) - paidBalance;
    const newReserveBalance =
      Number(isBranchExist.reserevedBalance) + paidBalance;
    const newUsedBalance = Number(isBranchExist.usedBalance) - paidBalance;

    const metaData = {
      loan: isLoanExist._id.toString(),
      paidBalance: paidBalance.toString(),
      newUserBalance: newUserBalance.toString(),
      newReserveBalance: newReserveBalance.toString(),
      newUsedBalance: newUsedBalance.toString(),
      monthsToPay: payload.monthsToPay.toString(),
      transactionType: payload.transactionType || "deposit-loan",
    };

    const url = await createPayment(paidBalance, isUserExist.email, metaData);
    console.log(url);

    await session.commitTransaction();
    await session.endSession();
    return url;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new AppError(HttpStatus.BAD_REQUEST, error as any);
  }
};

const getLoans = async () => {
  const result = await LoanModel.find().sort({
    status: -1,
  });
  return result;
};

const getEachLoans = async (id: string) => {
  const isLoanExist = await LoanModel.findById(id);
  if (!isLoanExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The loan is not exist");
  }
  const result = await LoanModel.findById(id);
  return result;
};

export const loadServices = {
  requestLoan,
  updateRequestedLoan,
  payLoan,
  getLoans,
  getEachLoans,
};
