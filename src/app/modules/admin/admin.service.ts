import HttpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { AdminSearchableFields } from "./admin.const";
import { Admin } from "./admin.model";
import AppError from "../../erros/AppError";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import { TAdmin } from "./admin.interface";

const getAdmin = async (query: Record<string, unknown>) => {
  const AdminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .pagination()
    .limitFields();

  const result = await AdminQuery.modelQuery;
  return result;
};

const getEachAdmin = async (id: string) => {
  const result = await Admin.findOne({
    _id: id,
  })
  return result;
};

const updateAdmin = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteEachAdmin = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteAdmin) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "failed to delete the Admin",
      );
    }
    const userId = deleteAdmin.user;
    const deleteAdminUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteAdminUser) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "failed to delete the Admin User",
      );
    }
    await session.commitTransaction();
    await session.endSession();

    return deleteAdmin;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const AdminServices = {
  getAdmin,
  getEachAdmin,
  updateAdmin,
  deleteEachAdmin,
};
