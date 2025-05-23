import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { accountServices } from "./account.service";

const createAccount = catchAsync(async (req, res) => {
  const result = await accountServices.createAccount(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Account created succesfully",
    data: result,
  });
});

const getAccounts = catchAsync(async (req, res) => {
  const result = await accountServices.getAccounts();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Accounts retrieved succesfully",
    data: result,
  });
});

export const accountControllers = {
  createAccount,
  getAccounts,
};
