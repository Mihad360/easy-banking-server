import { Types } from "mongoose";

export interface TUserName {
  firstName: string;
  lastName: string;
}

export interface TCustomer {
  customerId: string;
  user: Types.ObjectId;
  name: TUserName;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  city: string;
  postalCode: string;
  country: string;
  profilePhotoUrl?: string;
  isDeleted: boolean;
}
