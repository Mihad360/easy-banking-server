import HttpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { facultySearch } from "./faculty.const";
import { TFaculty } from "./faculty.interface";
import { FacultyModel } from "./faculty.model";
import AppError from "../../erros/AppError";
import { User } from "../user/user.model";

// const createFaculty = async (payload: TFaculty) => {
//   const result = await FacultyModel.create(payload);
//   return result;
// };

const getFaculty = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    FacultyModel.find().populate("academicDepartment"),
    query,
  )
    .search(facultySearch)
    .filter()
    .sort()
    .pagination()
    .limitFields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getEachFaculty = async (id: string) => {
  const result = await FacultyModel.findOne({
    _id: id,
  }).populate("academicFaculty");
  return result;
};

const updateFaculty = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await FacultyModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteEachFaculty = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteFaculty = await FacultyModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteFaculty) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "failed to delete the faculty",
      );
    }
    const userId = deleteFaculty.user;
    const deleteFacultyUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteFacultyUser) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "failed to delete the faculty User",
      );
    }
    await session.commitTransaction();
    await session.endSession();

    return deleteFaculty;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const facultyServices = {
  // createFaculty,
  getFaculty,
  getEachFaculty,
  updateFaculty,
  deleteEachFaculty
};
