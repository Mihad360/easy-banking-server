import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TUserInterface } from "./user.interface";
import { User } from "./user.model";
import { TCustomer } from "../Customer/customer.interface";
import { CustomerModel } from "../Customer/customer.model";
import mongoose from "mongoose";
import { generateCustomerId } from "./user.utils";
import { USER_ROLE } from "../../interface/global";

const createCustomer = async (payload: TCustomer) => {
  const userData: Partial<TUserInterface> = {};
  const isCustomerExist = await CustomerModel.findOne({
    customerId: payload.customerId,
  });
  if (isCustomerExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The Customer ID already exist");
  }

  const isUserExist = await User.findOne({ email: payload?.email });
  if (isUserExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The User is already exist");
  }

  userData.role = USER_ROLE.customer;
  userData.email = payload.email;
  userData.password = payload.password;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.customerId = await generateCustomerId();

    const newUser = await User.create([userData], { session });
    if (!newUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, "New User create failed");
    }

    payload.customerId = newUser[0].customerId;
    payload.user = newUser[0]._id;

    const newCustomer = await CustomerModel.create([payload], { session });
    if (!newCustomer) {
      throw new AppError(HttpStatus.BAD_REQUEST, "New Customer create failed");
    }

    await session.commitTransaction();
    await session.endSession();
    return newCustomer;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.NOT_FOUND, "Failed to create The Customer");
  }
};

const getUsers = async () => {
  const result = await User.find();
  return result;
};

export const userServices = {
  createCustomer,
  getUsers,
};
