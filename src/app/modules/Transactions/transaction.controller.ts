import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { transactionServices } from "./transaction.service";

const createDeposit = catchAsync(async (req, res) => {
  const result = await transactionServices.createDeposit(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Transaction completed succesfully",
    data: result,
  });
});

export const transactionControllers = {
  createDeposit,
};
