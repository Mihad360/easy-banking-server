import { Types } from "mongoose";
import { TDays } from "./offeredCourse.const";

export type TOfferedCourse = {
  academicSemester?: Types.ObjectId;
  semesterRegistration: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number;
  days: TDays[];
  startTime: string;
  endTime: string;
};
