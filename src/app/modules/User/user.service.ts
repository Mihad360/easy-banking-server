import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TUserInterface } from "./user.interface";
import { User } from "./user.model";
import { TCustomer } from "../Customer/customer.interface";
import { CustomerModel } from "../Customer/customer.model";
import mongoose from "mongoose";
import {
  generateAdminId,
  generateCustomerId,
  generateManagerId,
} from "./user.utils";
import { USER_ROLE } from "../../interface/global";
import { TManager } from "../Manager/manager.interface";
import { ManagerModel } from "../Manager/manager.model";
import { TAdmin } from "../Admin/admin.interface";
import { AdminModel } from "../Admin/admin.model";

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

const createManager = async (payload: TManager) => {
  const userData: Partial<TUserInterface> = {};
  const isManagerExist = await ManagerModel.findOne({
    managerId: payload.managerId,
  });
  if (isManagerExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The Manager already exist");
  }
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The User is already exist");
  }

  userData.role = USER_ROLE.manager;
  userData.email = payload.email;
  userData.password = payload.password;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.managerId = await generateManagerId();

    const newUser = await User.create([userData], { session });
    if (!newUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, "New User create failed");
    }
    payload.managerId = newUser[0].managerId;
    payload.user = newUser[0]._id;

    const newManager = await ManagerModel.create([payload], { session });
    if (!newManager) {
      throw new AppError(HttpStatus.BAD_REQUEST, "New Customer create failed");
    }

    await session.commitTransaction();
    await session.endSession();
    return newManager;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.NOT_FOUND, "Failed to create The Manager");
  }
};

const createAdmin = async (payload: TAdmin) => {
  const userData: Partial<TUserInterface> = {};
  const isAdminExist = await AdminModel.findOne({
    adminId: payload.adminId,
  });
  if (isAdminExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The Admin already exist");
  }
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The User is already exist");
  }

  userData.role = USER_ROLE.admin;
  userData.email = payload.email;
  userData.password = payload.password;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.adminId = await generateAdminId();

    const newUser = await User.create([userData], { session });
    if (!newUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, "New User create failed");
    }
    payload.adminId = newUser[0].adminId;
    payload.user = newUser[0]._id;

    const newAdmin = await AdminModel.create([payload], { session });
    if (!newAdmin) {
      throw new AppError(HttpStatus.BAD_REQUEST, "New Admin create failed");
    }

    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.NOT_FOUND, "Failed to create The Admin");
  }
};

export const userServices = {
  createCustomer,
  getUsers,
  createManager,
  createAdmin,
};
