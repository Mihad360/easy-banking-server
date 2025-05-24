import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { branchServices } from "./branch.service";

const createBranch = catchAsync(async (req, res) => {
  const result = await branchServices.createBranch(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Branch created succesfully",
    data: result,
  });
});

const getBranches = catchAsync(async (req, res) => {
  const result = await branchServices.getBranches();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Branch retrieved succesfully",
    data: result,
  });
});

export const branchControllers = {
  createBranch,
  getBranches,
};
