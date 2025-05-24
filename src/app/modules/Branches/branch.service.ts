import { TBranch } from "./branch.interface";
import { BranchModel } from "./branch.model";

const createBranch = async (payload: TBranch) => {
  const result = await BranchModel.create(payload);
  return result;
};

const getBranches = async () => {
  const result = await BranchModel.find();
  return result;
};

export const branchServices = {
  createBranch,
  getBranches,
};
