import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TAdmin } from "./admin.interface";
import { AdminModel } from "./admin.model";
import mongoose from "mongoose";

const getAdmins = async () => {
  const result = await AdminModel.find().populate("user");
  return result;
};

const getEachAdmin = async (id: string) => {
  const result = await AdminModel.findById(id).populate("user");
  return result;
};

const updateAdmin = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingData } = payload;
  const isAdminExist = await AdminModel.findById(id);
  if (!isAdminExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The admin is not found");
  }
  const isUserExist = await User.findById(isAdminExist?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  const modifiedData: Record<string, unknown> = {
    ...remainingData,
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (name && Object.keys(name).length) {
      for (const [key, value] of Object.entries(name)) {
        modifiedData[`name.${key}`] = value;
      }
    }
    const updateAdmin = await AdminModel.findByIdAndUpdate(
      id,
      modifiedData,
      { session, new: true },
    );
    if (!updateAdmin) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Admin update failed");
    }

    const updateUser = await User.findByIdAndUpdate(
      isUserExist?._id,
      { email: payload?.email },
      { session, new: true },
    );
    if (!updateUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Admin update failed");
    }

    await session.commitTransaction();
    await session.endSession();
    return updateAdmin;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, "Admin updating failed");
  }
};

export const adminServices = {
  getAdmins,
  getEachAdmin,
  updateAdmin,
};
