import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { TBranch } from "./branch.interface";
import { BranchModel } from "./branch.model";

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




  // ------ manager to---do ------ 





  const result = await BranchModel.create(payload);
  return result;
};

const getBranches = async () => {
  const result = await BranchModel.find();
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

export const branchServices = {
  createBranch,
  getBranches,
  getEachBranch,
  updateBranch,
};
