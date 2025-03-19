import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { semesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result = await semesterRegistrationServices.createSemesterRegistration(
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course created succesfully",
    data: result,
  });
});

const getSemesterRegistration = catchAsync(async (req, res) => {
  const result = await semesterRegistrationServices.getSemesterRegistrations(
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "SemesterRegistration find succesfully",
    data: result,
  });
});

const getEachSemesterRegistration = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result =
    await semesterRegistrationServices.getEachSemesterRegistration(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course find succesfully",
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await semesterRegistrationServices.updateSemesterRegistration(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course deleted succesfully",
    data: result,
  });
});

const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await semesterRegistrationServices.deleteSemesterRegistration(
    id,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Semester Registration deleted succesfully",
    data: result,
  });
});

export const semesterRegistrationControllers = {
  createSemesterRegistration,
  getSemesterRegistration,
  getEachSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration
};
