import { Types } from "mongoose";

export interface TAdmin {
  adminId?: string;
  user: Types.ObjectId;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  phoneNumber: string;
  profilePhotoUrl?: string;
  isDeleted?: boolean;
}
