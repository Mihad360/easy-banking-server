import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourse(req.body);

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

const updateCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseServices.updateCourse(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Course deleted succesfully",
    data: result,
  });
});

const assignFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFaculties(courseId, faculties);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "faculty assigned succesfully",
    data: result,
  });
});

const removeFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFaculties(courseId, faculties);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "faculty removed succesfully",
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getCourse,
  getEachCourse,
  deleteCourse,
  updateCourse,
  assignFaculties,
  removeFaculties
};
