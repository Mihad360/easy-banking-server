import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { loadServices } from "./loan.service";
import { TJwtUser } from "../../interface/global";

const requestLoan = catchAsync(async (req, res) => {
  const user = req.user as TJwtUser;
  const result = await loadServices.requestLoan(user, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Loan requested succesfully",
    data: result,
  });
});

const updateRequestedLoan = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await loadServices.updateRequestedLoan(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Loan approved and updated succesfully",
    data: result,
  });
});

const updateRePaymentSchedule = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await loadServices.updateRePaymentSchedule(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Loan payment details updated succesfully",
    data: result,
  });
});

export const loanControllers = {
  requestLoan,
  updateRequestedLoan,
  updateRePaymentSchedule,
};
