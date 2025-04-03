import { enrolledCourseServices } from "./enrolledCourse.service";
import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await enrolledCourseServices.createEnrolledCourse(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course Enrolled succesfully",
    data: result,
  });
});

export const endrolledCourseControllers = {
  createEnrolledCourse,
};
