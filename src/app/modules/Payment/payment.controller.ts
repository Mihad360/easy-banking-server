import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const createPayment = catchAsync(async (req, res) => {
  const result = await paymentServices.createPayment();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Payment created succesfully",
    data: result,
  });
});

export const paymentControllers = {
  createPayment,
};
