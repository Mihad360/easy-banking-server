/* eslint-disable @typescript-eslint/no-explicit-any */
import { academicDepartmentModel } from "./../academicDepartment/academicDepartment.model";
import HttpStatus from "http-status";
import config from "../../config";
import AppError from "../../erros/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";
import mongoose from "mongoose";
import { FacultyModel } from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import { TFaculty } from "../faculty/faculty.interface";
import { Admin } from "../admin/admin.model";
import { JwtPayload } from "jsonwebtoken";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createUserDB = async (file: any, password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_pass as string);
  userData.role = "student";
  userData.email = payload.email;

  const academicSemesterId = await AcademicSemester.findById(
    payload.academicSemester,
  );
  if (!academicSemesterId) {
    throw new AppError(400, "Academic semester not found");
  }

  // find department
  const academicDepartment = await academicDepartmentModel.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, "Aademic department not found");
  }
  payload.academicFaculty = academicDepartment?.academicFaculty;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (!academicSemesterId) {
      throw new AppError(HttpStatus.NOT_FOUND, "not available");
    }
    userData.id = await generateStudentId(academicSemesterId);

    // send image to cloudinary

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.NOT_FOUND, "Failed to create The Student");
  }
};

const createFacultyDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_pass as string);
  userData.role = "faculty";
  userData.email = payload.email;

  const academicDepartment = await academicDepartmentModel.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, "Academic department not found");
  }
  payload.academicFaculty = academicDepartment?.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const facultyId = await generateFacultyId();
    if (!facultyId) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Failed to generate faculty ID",
      );
    }
    userData.id = facultyId;
    // send image to cloudinary
    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }
    // first transaction - 1
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Failed to create user");
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // first transaction - 2
    const newFaculty = await FacultyModel.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Failed to create Faculty");
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.NOT_FOUND, "Failed to create The Faculty");
  }
};

const createAdminDB = async (file: any, password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_pass as string);
  userData.role = "admin";
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateAdminId();
    // send image to the cloudinary
    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }
    // first transaction - 1
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Failed to create Admin user");
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // first transaction - 2
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Failed to create Admin");
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, "Failed to create The Admin");
  }
};

const getMe = async (payload: JwtPayload) => {
  const { userId, role } = payload;
  let result = null;
  if (role === "student") {
    result = await Student.findOne({ id: userId })
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      });
  }
  if (role === "admin") {
    result = await Admin.findOne({ id: userId }).populate("user");
  }
  if (role === "faculty") {
    result = await FacultyModel.findOne({ id: userId }).populate("user");
  }
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const isStudentExist = await Student.findById(id);
  if (!isStudentExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "This Student is not found");
  }
  const user = isStudentExist?.user;
  const isUserExist = await User.findById(user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is not found");
  }
  const result = await User.findByIdAndUpdate(isUserExist?._id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createUserDB,
  createFacultyDB,
  createAdminDB,
  getMe,
  changeStatus,
};
