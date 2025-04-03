import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";

const createEnrolledCourse = async (payload: TEnrolledCourse) => {
  const result = await EnrolledCourse.create(payload);
  return result;
};

const getEnrolledCourses = async () => {
  const result = await EnrolledCourse.find();
  return result;
};

export const enrolledCourseServices = {
  createEnrolledCourse,
  getEnrolledCourses,
};
