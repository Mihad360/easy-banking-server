import HttpStatus from "http-status";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const getStudent = catchAsync(async (req, res) => {
  console.log(req.query);
  const result = await StudentServices.getAllStudent(req.query);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student find successfully",
    data: result,
  });
});

const getEachStudentId = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await StudentServices.getEachStudent(id);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student created succesfully",
    data: result,
  });
});

const deleteEachStudentId = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await StudentServices.deleteEachStudent(id);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student Deleted succesfully",
    data: result,
  });
});

const updateEachStudent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const {student} = req.body
  const result = await StudentServices.updateEachStudent(id, student);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student Updated succesfully",
    data: result,
  });
});

export const StudentControllers = {
  getStudent,
  getEachStudentId,
  deleteEachStudentId,
  updateEachStudent,
};
