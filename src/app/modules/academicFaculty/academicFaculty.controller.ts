import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFaculty(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student created succesfully",
    data: result,
  });
});

const getAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAcademicFaculty();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student created succesfully",
    data: result,
  });
});

const getEachAcademicFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AcademicFacultyServices.getEachAcademicFaculty(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Student created succesfully",
    data: result,
  });
});

// const updateEachAcademicSemester = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const result = await AcademicSemesterServices.updateEachAcademicSemester(
//     id,
//     req.body,
//   );

//   sendResponse(res, {
//     statusCode: HttpStatus.OK,
//     success: true,
//     message: "Student created succesfully",
//     data: result,
//   });
// });

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAcademicFaculty,
  getEachAcademicFaculty,
};
