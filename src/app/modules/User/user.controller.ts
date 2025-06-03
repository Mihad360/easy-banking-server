import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import config from "../../config";

const createCustomer = catchAsync(async (req, res) => {
  const file = req.file;
  const result = await userServices.createCustomer(file, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created succesfully",
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const result = await userServices.verifyOtp(req.body);
  const { accessToken, refreshToken, newUser } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    // sameSite: "none",
    // maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created successfully",
    data: {
      accessToken,
      newUser,
    },
  });
});

const getUsers = catchAsync(async (req, res) => {
  const result = await userServices.getUsers();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User retrived succesfully",
    data: result,
  });
});

const getManagers = catchAsync(async (req, res) => {
  const result = await userServices.getManagers();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Managers retrived succesfully",
    data: result,
  });
});

const getAdmins = catchAsync(async (req, res) => {
  const result = await userServices.getAdmins();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User retrived succesfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await userServices.updateUserRole(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User retrived succesfully",
    data: result,
  });
});

const getEachUsers = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await userServices.getEachUsers(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User retrived succesfully",
    data: result,
  });
});

export const userControllers = {
  createCustomer,
  getUsers,
  updateUserRole,
  verifyOtp,
  getManagers,
  getAdmins,
  getEachUsers,
};
