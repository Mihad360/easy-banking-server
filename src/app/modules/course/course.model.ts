import { model, Schema } from "mongoose";
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from "./course.interface";

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  isDeleted: { type: Boolean, default: false },
});

const CourseSchema = new Schema<TCourse>({
  title: { type: String, unique: true, trim: true, required: true },
  prefix: { type: String, trim: true, required: true },
  code: {
    type: Number,
    trim: true,
    required: true,
  },
  credits: { type: Number, trim: true, required: true },
  preRequisiteCourses: [preRequisiteCoursesSchema],
  isDeleted: { type: Boolean, default: false },
});

export const CourseModel = model<TCourse>("Course", CourseSchema);

const CourseFacultySchema = new Schema<TCourseFaculty>({
  course: { type: Schema.Types.ObjectId, required: true },
  faculties: [{ type: Schema.Types.ObjectId, ref: "Faculty" }],
});

export const CourseFacultyModel = model<TCourseFaculty>(
  "CourseFaculty",
  CourseFacultySchema,
);
