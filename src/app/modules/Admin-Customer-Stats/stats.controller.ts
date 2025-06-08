import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { statServices } from "./stats.service";

const getAdminStats = catchAsync(async (req, res) => {
  const result = await statServices.getAdminStats();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin stats retrieved succesfully",
    // meta: result.meta,
    data: result,
  });
});

const getLastMonthStats = catchAsync(async (req, res) => {
  const result = await statServices.getLastMonthStats();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Last month stats retrieved succesfully",
    // meta: result.meta,
    data: result,
  });
});

const getBankDetails = catchAsync(async (req, res) => {
  const result = await statServices.getBankDetails();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Bank details retrieved succesfully",
    // meta: result.meta,
    data: result,
  });
});

export const statControllers = {
  getAdminStats,
  getLastMonthStats,
  getBankDetails,
};
