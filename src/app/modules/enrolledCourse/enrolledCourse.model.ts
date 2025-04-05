import { model, Schema } from "mongoose";
import { TCourseMarks, TEnrolledCourse } from "./enrolledCourse.interface";
import { Grade } from "./enrolledCourse.const";

const courseMarksSchema = new Schema<TCourseMarks>({
  classTest1: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  midTerm: {
    type: Number,
    min: 0,
    max: 30,
    default: 0,
  },
  classTest2: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  finalTerm: {
    type: Number,
    min: 0,
    max: 50,
    default: 0,
  },
});

const EnrolledCourseSchema = new Schema<TEnrolledCourse>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
      required: true,
    },
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: "SemesterRegistration",
      required: true,
    },
    offeredCourse: {
      type: Schema.Types.ObjectId,
      ref: "OfferedCourse",
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    isEnrolled: { type: Boolean, default: false },
    grade: { type: String, enum: Grade, default: "NA" },
    courseMarks: { type: courseMarksSchema, default: {} },
    gradePoints: { type: Number, min: 0, max: 4, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const EnrolledCourse = model<TEnrolledCourse>(
  "EnrolledCourse",
  EnrolledCourseSchema,
);
