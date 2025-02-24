import HttpStatus from "http-status";
import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../erros/AppError";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";

const getAllStudent = async () => {
  const result = await Student.find()
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

const getEachStudent = async (id: string) => {
  // const result = await Student.findOne({id });
  const result = await Student.findOne({ id })
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
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Delete Student failed");
    }
    const deletedUser = await User.findOneAndUpdate(
      { id },
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

  const result = await Student.findOneAndUpdate({ id }, modifiedData, {
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
