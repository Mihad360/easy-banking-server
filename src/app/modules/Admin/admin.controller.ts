import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAdmins = catchAsync(async (req, res) => {
  const result = await adminServices.getAdmins();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admins retrieved succesfully",
    data: result,
  });
});

const getEachAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await adminServices.getEachAdmin(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin retrieved succesfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await adminServices.updateAdmin(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin updated succesfully",
    data: result,
  });
});

export const adminControllers = {
  getAdmins,
  getEachAdmin,
  updateAdmin,
};
