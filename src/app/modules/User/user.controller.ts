import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const createCustomer = catchAsync(async (req, res) => {
  const result = await userServices.createCustomer(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created succesfully",
    data: result,
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

export const userControllers = {
  createCustomer,
  getUsers,
};
