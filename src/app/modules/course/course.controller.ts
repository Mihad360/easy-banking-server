import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
  const {course} = req.body
  const result = await CourseServices.createCourse(course);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course created succesfully",
    data: result,
  });
});

const getCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getCourses(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course find succesfully",
    data: result,
  });
});

const getEachCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseServices.getEachCourse(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course find succesfully",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseServices.deleteCourse(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course deleted succesfully",
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getCourse,
  getEachCourse,
  deleteCourse,
};
