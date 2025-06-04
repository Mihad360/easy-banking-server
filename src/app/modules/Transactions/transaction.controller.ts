import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { transactionServices } from "./transaction.service";
import { TJwtUser } from "../../interface/global";

const createDeposit = catchAsync(async (req, res) => {
  const user = req.user as TJwtUser;
  const result = await transactionServices.createDeposit(user, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Deposit completed succesfully",
    data: result,
  });
});

const createWithdraw = catchAsync(async (req, res) => {
  const user = req.user as TJwtUser;
  const result = await transactionServices.createWithdraw(user, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Withdraw completed succesfully",
    data: result,
  });
});

const createTransfer = catchAsync(async (req, res) => {
  const user = req.user as TJwtUser;
  const result = await transactionServices.createTransfer(user, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Transfer completed succesfully",
    data: result,
  });
});

const getTransactions = catchAsync(async (req, res) => {
  const result = await transactionServices.getTransactions();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Transfer retrieved succesfully",
    data: result,
  });
});

const getEachTransactions = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await transactionServices.getEachTransactions(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Transfer retrieved succesfully",
    data: result,
  });
});

const getPersonalTransactions = catchAsync(async (req, res) => {
  const user = req.user as TJwtUser;
  const result = await transactionServices.getPersonalTransactions(user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Transfer retrieved succesfully",
    data: result,
  });
});

export const transactionControllers = {
  createDeposit,
  createWithdraw,
  createTransfer,
  getTransactions,
  getPersonalTransactions,
  getEachTransactions,
};
