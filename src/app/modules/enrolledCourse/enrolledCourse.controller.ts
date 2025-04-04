import { enrolledCourseServices } from "./enrolledCourse.service";
import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await enrolledCourseServices.createEnrolledCourse(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course Enrolled succesfully",
    data: result,
  });
});

const getEnrolledCourses = catchAsync(async (req, res) => {
  const result = await enrolledCourseServices.getEnrolledCourses();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Courses get succesfully",
    data: result,
  });
});

const getEachEnrolledCourses = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await enrolledCourseServices.getEachEnrolledCourses(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course get succesfully",
    data: result,
  });
});

export const endrolledCourseControllers = {
  createEnrolledCourse,
  getEnrolledCourses,
  getEachEnrolledCourses,
};
