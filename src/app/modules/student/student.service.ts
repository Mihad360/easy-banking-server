import HttpStatus from "http-status";
import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../erros/AppError";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearch } from "./student.const";

const getAllStudent = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find().populate('user')
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query,
  )
    .search(studentSearch)
    .filter()
    .sort()
    .pagination()
    .limitFields();

  const result = await studentQuery.modelQuery;
  return result;

  // const queryObj = { ...query }; // copy the query
  // // searchTerm method --------
  // const studentSearch = [
  //   "email",
  //   "name.firstName",
  //   "name.lastName",
  //   "presentAddress",
  // ];
  // let searchTerm = "";
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }
  // // chaining without await method ----
  // const searchQuery = Student.find({
  //   $or: studentSearch?.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: "i" },
  //   })),
  // });
  // // exclude / delete the search, sort, limit to get the email query ------
  // const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // // chaining without await
  // // filter by email query with searchQuery ---------
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate("admissionSemester")
  //   .populate({
  //     path: "academicDepartment",
  //     populate: {
  //       path: "academicFaculty",
  //     },
  //   });
  // // sort method--------
  // let sort = "-createdAt";
  // if (query?.sort) {
  //   sort = query?.sort as string;
  // }
  // const sortQuery = filterQuery.sort(sort);
  // // get limit data method --------------
  // // get pagination data method --------------
  // let limit = 1;
  // let page = 1;
  // let skip = 0;
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }
  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }
  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);
  // // query with limit fields -------------
  // let fields = "-__v";
  // if (query.fields) {
  //   fields = (query.fields as string).split(",").join(" ");
  // }
  // const fieldQuery = await limitQuery.select(fields);
  // return fieldQuery;
};

const getEachStudent = async (id: string) => {
  // const result = await Student.findOne({id });
  const result = await Student.findById(id)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

const deleteEachStudent = async (id: string) => {
  const session = await mongoose.startSession();

  const isUserExist = await Student.findOne({ id, isDeleted: true });
  const isUserExists = await User.findOne({ id, isDeleted: true });
  if (isUserExist?.isDeleted || isUserExists?.isDeleted) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The user is already deleted");
  }

  try {
    session.startTransaction();
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Delete Student failed");
    }
    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Delete User failed");
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.NOT_FOUND, "Failed to Delelte The Student");
  }
};

const updateEachStudent = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, ...remainingStudentData } = payload;

  const modifiedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedData[`guardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const StudentServices = {
  getAllStudent,
  getEachStudent,
  deleteEachStudent,
  updateEachStudent,
};
