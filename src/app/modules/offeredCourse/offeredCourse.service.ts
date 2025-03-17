import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourseModel } from "./offeredCourse.model";
import SemesterRegistrationModel from "../semesterRegistration/semesterRegistration.model";
import { FacultyModel } from "../faculty/faculty.model";
import { CourseModel } from "../course/course.model";
import { academicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";

const createOfferedCourse = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    academicFaculty,
    course,
    faculty,
  } = payload;
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This semester registration is not found",
    );
  }
  const isAcademicFacultyExists =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This Academic Faculty is not found",
    );
  }
  const isAcademicDepartmentExists =
    await academicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This Academic Department is not found",
    );
  }
  const isCourseExists = await CourseModel.findById(course);
  if (!isCourseExists) {
    throw new AppError(HttpStatus.NOT_FOUND, "This Course is not found");
  }
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(HttpStatus.NOT_FOUND, "This Faculty is not found");
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return result;
};
const getOfferedCourse = async () => {
  const result = await OfferedCourseModel.find().populate(
    "semesterRegistration",
  );
  return result;
};
const getEachOfferedCourse = async (payload: TOfferedCourse) => {
  const result = await OfferedCourseModel.create(payload);
  return result;
};
const updateOfferedCourse = async (payload: TOfferedCourse) => {
  const result = await OfferedCourseModel.create(payload);
  return result;
};

export const offeredCourseServices = {
  createOfferedCourse,
  getOfferedCourse,
  getEachOfferedCourse,
  updateOfferedCourse,
};
