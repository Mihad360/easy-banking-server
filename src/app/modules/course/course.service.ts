import HttpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearch } from "./course.const";
import { TCourse, TCourseFaculty } from "./course.interface";
import { CourseFacultyModel, CourseModel } from "./course.model";
import AppError from "../../erros/AppError";
import mongoose from "mongoose";

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
  const meta = await courseQuery.countTotal();
  const result = await courseQuery.modelQuery;
  return { meta, result };
};

const getAssignedFaculties = async () => {
  const result = await CourseFacultyModel.find().populate("faculties");
  return result;
};

const getEachAssignedFaculties = async (id: string) => {
  const result = await CourseFacultyModel.findOne({ course: id }).populate(
    "faculties",
  );
  return result;
};

const getEachCourse = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    "preRequisiteCourses.course",
  );
  return result;
};

const updateCourse = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const basicCourseUpdate = await CourseModel.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!basicCourseUpdate) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "failed to update basic course",
      );
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequisiteCourses = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      const deletedCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: deletedPreRequisiteCourses },
            },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!deletedCourses) {
        throw new AppError(HttpStatus.BAD_REQUEST, "failed to update course");
      }

      //filter out the isDeleted=false data
      const newPreRequisiteCourses = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );
      const newPreRequisiteCoursesAdd = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisiteCourses } },
        },
        { new: true, runValidators: true, session },
      );

      if (!newPreRequisiteCoursesAdd) {
        throw new AppError(HttpStatus.BAD_REQUEST, "failed to update course");
      }
      const result = await CourseModel.findById(id).populate(
        "preRequisiteCourses.course",
      );
      return result;
    }
    await session.commitTransaction();
    await session.endSession();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, "failed to update course");
  }
};

const deleteCourse = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const assignFaculties = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};

const removeFaculties = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  createCourse,
  getCourses,
  getEachCourse,
  updateCourse,
  deleteCourse,
  assignFaculties,
  removeFaculties,
  getAssignedFaculties,
  getEachAssignedFaculties,
};
