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

export const loanControllers = {
  requestLoan,
};
