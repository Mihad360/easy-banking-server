import { TUserInterface } from "./user.interface";
import { UserModel } from "./user.model";

const createUser = async (payload: TUserInterface) => {
  const result = await UserModel.create(payload);
  return result;
};

const getUsers = async () => {
  const result = await UserModel.find();
  return result;
};

export const userServices = {
  createUser,
  getUsers,
};
