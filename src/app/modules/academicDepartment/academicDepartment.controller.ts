import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.createAcademicDepartment(
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Academic Department created succesfully",
    data: result,
  });
});

const getAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.getAcademicDepartment(req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Academic Department retrieved succesfully",
    meta: result.meta,
    data: result.result,
  });
});

const getEachAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AcademicDepartmentServices.getEachAcademicDepartment(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Academic Department found succesfully",
    data: result,
  });
});

const updateEachAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AcademicDepartmentServices.updateEachAcademicDepartment(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "SAcademic Department updated succesfully",
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAcademicDepartment,
  getEachAcademicDepartment,
  updateEachAcademicDepartment,
};
