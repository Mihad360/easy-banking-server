import { Types } from "mongoose";

export type TCourseMarks = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
};

export type TGrade = "A" | "B" | "C" | "D" | "F" | "NA";

export type TEnrolledCourse = {
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  semesterRegistration: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  student: Types.ObjectId;
  faculty: Types.ObjectId;
  isEnrolled: boolean;
  grade: TGrade;
  courseMarks: TCourseMarks;
  gradePoints: number;
  isCompleted: boolean;
};
