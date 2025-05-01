import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { OfferedCourseModel } from "../offeredCourse/offeredCourse.model";
import { Student } from "../student/student.model";
import mongoose from "mongoose";
import SemesterRegistrationModel from "../semesterRegistration/semesterRegistration.model";
import { CourseModel } from "../course/course.model";
import { FacultyModel } from "../faculty/faculty.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  // get the offeredCourse and check is it existed --
  // if it existed check the maxCapacity that is it more than 0 or not
  // then get the student by decoded token userId that student is exist or not
  // check that the student is already enrolled the course with same semester Registration and offeredCourse coming from payload
  // then we need to check the maxCredits for a student and course. we can find the course from offeredCourse id and get the course. Then we can get the semesterRegistration with maxCredit for a semester.
  // then match the student and semesterRegistration at the EnrolledCourse Model to get the data. we can lookup them in Course model to get the previous enrolled course data.
  // then we can Sum the previous credits with new incoming course credits and make a condition with > total maxCredit from semesterRegistration
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

  const student = await Student.findOne({ id: userId }, { _id: 1 });
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

  const course = await CourseModel.findById(isOfferedCourseExist.course);
  // check total credit and max-min credits
  const semesterRegistrationExist = await SemesterRegistrationModel.findById(
    isOfferedCourseExist?.semesterRegistration,
  ).select("maxCredit minCredit");

  if (!semesterRegistrationExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "The semester Registration did not found",
    );
  }

  // total enrolled credits + new enrolled credits > maxCredit
  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExist.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "enrolledCourseData",
      },
    },
    { $unwind: "$enrolledCourseData" },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
  const courseCredits = course?.credits;
  const totalMaxCredits = semesterRegistrationExist.maxCredit;
  if (totalCredits && totalCredits + courseCredits > totalMaxCredits) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "You have reached the maximum number of credits",
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
  const result = await EnrolledCourse.find().populate(
    "course offeredCourse semesterRegistration student faculty academicDepartment academicFaculty academicSemester",
  );
  return result;
};

const getMyEnrolledCourses = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const isStudentExist = await Student.findOne({ id: studentId });
  if (!isStudentExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "Failed to find the student");
  }
  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: isStudentExist._id }).populate(
      "semesterRegistration academicDepartment academicFaculty course academicSemester offeredCourse faculty student",
    ),
    query,
  )
    .filter()
    .sort()
    .pagination()
    .limitFields();
  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();
  return { meta, result };
};

const getEachEnrolledCourses = async (id: string) => {
  const result = await EnrolledCourse.findById(id);
  return result;
};

const updateEnrolledCourses = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This Semester Registration did not found",
    );
  }

  const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse);
  if (!isOfferedCourseExist) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "This Offered course did not found",
    );
  }

  const isStudentExist = await Student.findById(student);
  if (!isStudentExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "This Student did not found");
  }

  const faculty = await FacultyModel.findOne({ id: userId }).select("_id");
  if (!faculty) {
    throw new AppError(HttpStatus.NOT_FOUND, "This Faculty did not found");
  }
  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });
  if (!isCourseBelongToFaculty) {
    throw new AppError(HttpStatus.FORBIDDEN, "You are forbidden");
  }

  const currentEnrolledCourse = await EnrolledCourse.findById(
    isCourseBelongToFaculty?._id,
  );

  const updatedMarks = {
    classTest1:
      courseMarks?.classTest1 ?? currentEnrolledCourse?.courseMarks.classTest1,
    midTerm: courseMarks?.midTerm ?? currentEnrolledCourse?.courseMarks.midTerm,
    classTest2:
      courseMarks?.classTest2 ?? currentEnrolledCourse?.courseMarks.classTest2,
    finalTerm:
      courseMarks?.finalTerm ?? currentEnrolledCourse?.courseMarks.finalTerm,
  };

  const modifiedData: Record<string, unknown> = {
    courseMarks: updatedMarks,
  };
  console.log(updatedMarks);
  if (courseMarks?.finalTerm !== undefined && courseMarks.finalTerm > 0) {
    const totalMark =
      Math.ceil(Number(updatedMarks.classTest1 || 0)) +
      Math.ceil(Number(updatedMarks.midTerm || 0)) +
      Math.ceil(Number(updatedMarks.classTest2 || 0)) +
      Math.ceil(Number(updatedMarks.finalTerm));

    const totalGradePoints = calculateGradeAndPoints(totalMark);
    modifiedData.grade = totalGradePoints?.grade;
    modifiedData.gradePoints = totalGradePoints?.gradePoints;
    modifiedData.isCompleted = true;
  }

  // if (courseMarks && Object.keys(courseMarks).length) {
  //   for (const [key, value] of Object.entries(courseMarks)) {
  //     modifiedData[`courseMarks.${key}`] = value;
  //   }
  // }

  const id = isCourseBelongToFaculty?._id;
  const result = await EnrolledCourse.findByIdAndUpdate(id, modifiedData, {
    new: true,
  });
  return result;
};

export const enrolledCourseServices = {
  createEnrolledCourse,
  getEnrolledCourses,
  getEachEnrolledCourses,
  updateEnrolledCourses,
  getMyEnrolledCourses,
};
