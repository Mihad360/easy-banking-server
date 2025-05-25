import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TManager } from "./manager.interface";
import { ManagerModel } from "./manager.model";
import { User } from "../User/user.model";
import mongoose from "mongoose";

const getManagers = async () => {
  const result = await ManagerModel.find().populate("user");
  return result;
};

const getEachManager = async (id: string) => {
  const result = await ManagerModel.findById(id).populate("user");
  return result;
};

const updateManager = async (id: string, payload: Partial<TManager>) => {
  const { name, ...remainingData } = payload;
  const isManagerExist = await ManagerModel.findById(id);
  if (!isManagerExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The manager is not found");
  }
  const isUserExist = await User.findById(isManagerExist?.user);
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
    const updateManager = await ManagerModel.findByIdAndUpdate(
      id,
      modifiedData,
      { session, new: true },
    );
    if (!updateManager) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Manager update failed");
    }

    const updateUser = await User.findByIdAndUpdate(
      isUserExist?._id,
      { email: payload?.email },
      { session, new: true },
    );
    if (!updateUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Manager update failed");
    }

    await session.commitTransaction();
    await session.endSession();
    return updateManager;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, "Manager updating failed");
  }
};

export const managerServices = {
  getManagers,
  getEachManager,
  updateManager,
};
