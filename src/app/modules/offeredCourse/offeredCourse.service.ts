import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourseModel } from "./offeredCourse.model";
import SemesterRegistrationModel from "../semesterRegistration/semesterRegistration.model";
import { FacultyModel } from "../faculty/faculty.model";
import { CourseModel } from "../course/course.model";
import { academicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { hasTimeConflict } from "./OfferedCourse.utils";

const createOfferedCourse = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    academicFaculty,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This semester registration is not found",
    );
  }
  const academicSemester = isSemesterRegistrationExists.academicSemester;
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

  // check if the department belong to the faculty
  const isDepartmentBelongToFaculty = await academicDepartmentModel.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`,
    );
  }

  const isSameOfferedCourseSameRegistrationSameSection =
    await OfferedCourseModel.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (isSameOfferedCourseSameRegistrationSameSection) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Offered course with same section is already exists",
    );
  }

  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");
  // console.log(assignedSchedules);

  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      HttpStatus.CONFLICT,
      "This Faculty is not available at that time ! Choose other time or day",
    );
  }

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return result;
  // return null;
};
const getOfferedCourse = async () => {
  const result = await OfferedCourseModel.find().populate(
    "semesterRegistration",
  );
  return result;
};
const getEachOfferedCourse = async (id: string) => {
  const result = await OfferedCourseModel.findById(id);
  return result;
};
const updateOfferedCourse = async (
  id: string,
  payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">,
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferedCourseExist = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This Offered Course is not found",
    );
  }
  const isFacultyExist = await FacultyModel.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "This Faculty is not found");
  }

  const semesterRegistration = isOfferedCourseExist.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `You Cannot update this offered course as it is ${semesterRegistrationStatus?.status}`,
    );
  }

  // const facultyId = isFacultyExist.faculty;
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      HttpStatus.CONFLICT,
      "This Faculty is not available at that time ! Choose other time or day",
    );
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourse = async (id: string) => {
  const isOfferedCourseExist = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "This Offered Course in not exist",
    );
  }
  const semesterRegistration = isOfferedCourseExist.semesterRegistration;
  const isSemesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration).select(
      "status",
    );
  if (isSemesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      `This offered course cannot be deleted as it is ${isSemesterRegistrationStatus?.status}`,
    );
  }
  
  const result = await OfferedCourseModel.findByIdAndDelete(id);
  return result;
};

export const offeredCourseServices = {
  createOfferedCourse,
  getOfferedCourse,
  getEachOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
