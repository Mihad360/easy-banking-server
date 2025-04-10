import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.getAdmin(req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin retrieved succesfully",
    meta: result.meta,
    data: result.result,
  });
});

const getEachAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminServices.getEachAdmin(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin found succesfully",
    data: result,
  });
});

const updateEachAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminServices.updateAdmin(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin updated succesfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteEachAdmin(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Admin is deleted succesfully",
    data: result,
  });
});

export const adminControllers = {
  getAdmin,
  getEachAdmin,
  updateEachAdmin,
  deleteAdmin,
};
