import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TBranch } from "./branch.interface";
import { BranchModel } from "./branch.model";
import { ManagerModel } from "../Manager/manager.model";
import { Document, Types } from "mongoose";
import { TManager } from "../Manager/manager.interface";

const createBranch = async (payload: TBranch) => {
  const isSameCodeBranchExist = await BranchModel.findOne({
    code: payload.code,
  });
  if (isSameCodeBranchExist) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Same code of branch is already exist",
    );
  }

  const isSameZipCodeBranchExist = await BranchModel.findOne({
    zipCode: payload.zipCode,
  });
  if (isSameZipCodeBranchExist) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Same Zip code of branch is already exist",
    );
  }

  let isManagersExist: (Document<unknown, TManager> &
    TManager & { _id: Types.ObjectId } & { __v: number })[] = [];
  if (payload.managers && payload.managers?.length > 0) {
    isManagersExist = await ManagerModel.find({
      _id: {
        $in: payload.managers.map((id) => new Types.ObjectId(id)),
      },
    });
    if (isManagersExist.length !== payload.managers?.length) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        "One or more managers are not exist",
      );
    }
  } else {
    isManagersExist = [];
  }

  const result = await BranchModel.create(payload);
  return result;
};

const getBranches = async () => {
  const result = await BranchModel.find().populate("managers");
  return result;
};

const getEachBranch = async (id: string) => {
  const result = await BranchModel.findById(id);
  return result;
};

const updateBranch = async (id: string, payload: Partial<TBranch>) => {
  const isBranchExist = await BranchModel.findById(id);
  if (!isBranchExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The branch is not exist");
  }
  const { openingSchedule, contactNumber, services, ...remainingData } =
    payload;

  const modifiedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (openingSchedule && Object.keys(openingSchedule).length) {
    for (const [key, value] of Object.entries(openingSchedule)) {
      modifiedData[`openingSchedule.${key}`] = value;
    }
  }

  if (contactNumber && Object.keys(contactNumber).length) {
    for (const [key, value] of Object.entries(contactNumber)) {
      modifiedData[`contactNumber.${key}`] = value;
    }
  }

  if (services && Object.keys(services).length) {
    for (const [key, value] of Object.entries(services)) {
      modifiedData[`services.${key}`] = value;
    }
  }

  const result = await BranchModel.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const updateBranchManagers = async (
  id: string,
  data: { managers: string[] },
) => {
  const { managers } = data;

  const managerObjectIds = managers.map((id) => new Types.ObjectId(id));

  if (!managerObjectIds.length) {
    throw new AppError(HttpStatus.NOT_FOUND, "The manager is empty");
  }

  if (managerObjectIds.length > 0) {
    const existingManagers = await ManagerModel.find({
      _id: { $in: managerObjectIds },
    });

    if (existingManagers.length !== managerObjectIds.length) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        "One or more manager IDs are invalid or do not exist.",
      );
    }
  }

  const result = await BranchModel.findByIdAndUpdate(
    id,
    { $set: { managers: managerObjectIds } },
    { new: true },
  );

  if (!result) {
    throw new AppError(HttpStatus.NOT_FOUND, "Branch not found.");
  }

  return result;
};

export const branchServices = {
  createBranch,
  getBranches,
  getEachBranch,
  updateBranch,
  updateBranchManagers,
};
