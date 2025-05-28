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
    message: "Transaction completed succesfully",
    data: result,
  });
});

const createWithdraw = catchAsync(async (req, res) => {
  const user = req.user as TJwtUser;
  const result = await transactionServices.createWithdraw(user, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Transaction completed succesfully",
    data: result,
  });
});

export const transactionControllers = {
  createDeposit,
  createWithdraw,
};
