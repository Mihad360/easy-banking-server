import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { managerServices } from "./manager.service";

const getManagers = catchAsync(async (req, res) => {
  const result = await managerServices.getManagers();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Managers retrived succesfully",
    data: result,
  });
});

const getEachManager = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await managerServices.getEachManager(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Manager retrived succesfully",
    data: result,
  });
});

const updateManager = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await managerServices.updateManager(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Manager updated succesfully",
    data: result,
  });
});

export const managerControllers = {
  getManagers,
  getEachManager,
  updateManager,
};
