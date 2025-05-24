import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { TCustomer } from "./customer.interface";
import { CustomerModel } from "./customer.model";
import mongoose from "mongoose";

const getCustomers = async () => {
  const result = await CustomerModel.find().populate("user");
  return result;
};

const getEachCustomer = async (id: string) => {
  const result = await CustomerModel.findById(id);
  return result;
};

const updateCustomer = async (id: string, payload: Partial<TCustomer>) => {
  const isCustomerExist = await CustomerModel.findById(id);
  if (!isCustomerExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The customer is not found");
  }

  const { name, ...remainingData } = payload;
  const modifiedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  const result = await CustomerModel.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCustomer = async (id: string) => {
  const isCustomerExist = await CustomerModel.findOne({
    _id: id,
    isDeleted: true,
  });
  const isUserExist = await User.findOne({ _id: id, isDeleted: true });
  if (isCustomerExist?.isDeleted || isUserExist?.isDeleted) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The user is already deleted");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteCustomer) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Customer delete failed");
    }

    const userId = deleteCustomer?.user;
    const deleteUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Customer/User delete failed");
    }
    await session.commitTransaction();
    await session.endSession();
    return deleteCustomer;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, "Customer/User delete failed");
  }
};

export const customerServices = {
  getCustomers,
  getEachCustomer,
  updateCustomer,
  deleteCustomer,
};
