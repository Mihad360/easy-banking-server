import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { OfferedCourseModel } from "../offeredCourse/offeredCourse.model";
import { Student } from "../student/student.model";
import mongoose from "mongoose";

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;
  const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse);
  if (!isOfferedCourseExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This Offered course did not found",
    );
  }
  if (isOfferedCourseExist.maxCapacity === 0) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The room is full");
  }

  const student = await Student.findOne({ id: userId }).select("id");
  if (!student) {
    throw new AppError(HttpStatus.NOT_FOUND, "The Student did not found");
  }
  const isStudentAlredyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExist?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });
  if (isStudentAlredyEnrolled) {
    throw new AppError(
      HttpStatus.CONFLICT,
      "The Student already enrolled to that course",
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await EnrolledCourse.create(
      [
        {
          academicSemester: isOfferedCourseExist.academicSemester,
          academicFaculty: isOfferedCourseExist.academicFaculty,
          semesterRegistration: isOfferedCourseExist.semesterRegistration,
          offeredCourse: offeredCourse,
          academicDepartment: isOfferedCourseExist.academicDepartment,
          course: isOfferedCourseExist.course,
          student: student._id,
          faculty: isOfferedCourseExist.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );
    if (!result) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Failed to enroll the course");
    }
    const maxCapacity = isOfferedCourseExist.maxCapacity;
    await OfferedCourseModel.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });
    await session.commitTransaction();
    await session.endSession();
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getEnrolledCourses = async () => {
  const result = await EnrolledCourse.find();
  return result;
};

export const enrolledCourseServices = {
  createEnrolledCourse,
  getEnrolledCourses,
};
