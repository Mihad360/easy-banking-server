import HttpStatus from "http-status";
import config from "../../config";
import AppError from "../../erros/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";
import mongoose from "mongoose";

const createUserDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_pass as string);
  userData.role = "student";

  const admissionSemesterId = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (!admissionSemesterId) {
      throw new AppError(HttpStatus.NOT_FOUND, "not available");
    }
    userData.id = await generateStudentId(admissionSemesterId);
    // first transaction - 1
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Failed to create user");
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    // first transaction - 2
    const newStudent = await Student.create([payload], { session });
    if (!newStudent) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Failed to create Student");
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.NOT_FOUND, "Failed to create The Student");
  }
};

export const UserServices = {
  createUserDB,
};
