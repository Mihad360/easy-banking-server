import HttpStatus from "http-status";
import { LoanModel } from "../../modules/Loan/loan.model";
import AppError from "../../erros/AppError";
import mongoose, { Types } from "mongoose";
import { AccountModel } from "../../modules/Account/account.model";
import { BranchModel } from "../../modules/Branches/branch.model";
import { TransactionModel } from "../../modules/Transactions/transaction.model";
import { generateTransactionId } from "../../modules/Transactions/transaction.utils";
import Stripe from "stripe";
import { TLoan } from "../../modules/Loan/loan.interface";
import { TBranch } from "../../modules/Branches/branch.interface";

type LoanWithBranchPopulated = TLoan & {
  branch: TBranch | Types.ObjectId;
};

export const completeDepostiLoan = async (metadata: Stripe.Metadata) => {
  // console.log(metadata);
  const isLoanExist = (await LoanModel.findById(metadata.loan).populate(
    "branch",
  )) as LoanWithBranchPopulated;
  if (!isLoanExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The Loan request is not found");
  }
  const paidBalance = Number(metadata.paidBalance);
  const newUserBalance = Number(metadata.newUserBalance);
  const newReserveBalance = Number(metadata.newReserveBalance);
  const newUsedBalance = Number(metadata.newUsedBalance);
  const monthsToPay = Number(metadata.monthsToPay);
  const newRemainingBalance =
    Number(isLoanExist.remainingBalance) - paidBalance;
console.log(newReserveBalance)
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
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
    if (unPaids.length < monthsToPay) {
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
      if (!item.paid && count < monthsToPay) {
        count++;
        return {
          ...item,
          paid: true,
          paidDate: new Date(),
        };
      }
      return item;
    });
    const updatedPay = await LoanModel.findOneAndUpdate(
      { accountNumber: isLoanExist.accountNumber },
      {
        $set: { repaymentSchedule: updatedSchedule },
        remainingBalance: newRemainingBalance && newRemainingBalance,
      },
      { session, new: true },
    );

    const branch = isLoanExist.branch as TBranch;
    const transaction_Id = await generateTransactionId("deposit-loan");
    const fromAccount = isLoanExist.accountNumber;
    const toAccount = branch.name;
    const transaction = {
      account: isLoanExist.accountNumber,
      user: isLoanExist.user,
      transactionType: metadata.transactionType,
      transaction_Id: transaction_Id,
      status: "completed",
      description: "Loan Deposit successfull",
      amount: paidBalance,
      fromAccount: fromAccount,
      toAccount: toAccount,
    };
    const sendTransaction = await TransactionModel.create(transaction);
    if (!sendTransaction) {
      throw new AppError(HttpStatus.NOT_FOUND, "Transaction send failed");
    }

    await session.commitTransaction();
    await session.endSession();
    return updatedPay;
    return updatedPay;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new AppError(HttpStatus.BAD_REQUEST, error as any);
  }
};
