import { Model } from "mongoose";

export type TUserInterface = {
  customerId: string;
  email: string;
  password: string;
  role: string;
  isDeleted: boolean;
};

export interface UserModel extends Model<TUserInterface> {
  isUserExistByEmail(email: string): Promise<TUserInterface>;
  compareUserPassword(
    payloadPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
