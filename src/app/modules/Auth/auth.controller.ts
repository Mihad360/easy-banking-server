import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie("accessToken", accessToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    // sameSite: "none",
    // maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    // sameSite: "none",
    // maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Login succesfully",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Refresh Token created succesfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgetPassword(req.body.email);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "forget password succesfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await authServices.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "reset password succesfully",
    data: result,
  });
});

export const authControllers = {
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
};
