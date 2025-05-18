import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Login succesfully",
    data: result,
  });
});

export const authControllers = {
  loginUser,
};
