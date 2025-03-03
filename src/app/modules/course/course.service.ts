import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearch } from "./course.const";
import { TCourse } from "./course.interface";
import { CourseModel } from "./course.model";

const createCourse = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getCourses = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate("preRequisiteCourses.course"),
    query,
  )
    .search(courseSearch)
    .filter()
    .sort()
    .pagination()
    .limitFields();
  const result = courseQuery.modelQuery;
  return result;
};

const getEachCourse = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    "preRequisiteCourses.course",
  );
  return result;
};

const updateCourse = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(id);
  return result;
};

const deleteCourse = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourse,
  getCourses,
  getEachCourse,
  updateCourse,
  deleteCourse,
};
