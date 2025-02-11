import HttpStatus from "http-status";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const getStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudent();
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student created succesfully",
    data: result,
  });
});

const getEachStudentId = catchAsync(async (req, res) => {
  const studentId = req.params.id;
  const result = await StudentServices.getEachStudent(studentId);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student created succesfully",
    data: result,
  });
});

const deleteEachStudentId = catchAsync(async (req, res) => {
  const studentId = req.params.id;
  const result = await StudentServices.deleteEachStudent(studentId);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student created succesfully",
    data: result,
  });
});

export const StudentControllers = {
  getStudent,
  getEachStudentId,
  deleteEachStudentId,
};
