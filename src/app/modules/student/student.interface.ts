import { Model, Types } from "mongoose";

export type TGuardian = {
  fatherName: string;
  motherName: string;
  fatherOccupation: string;
  motherOccupation: string;
  contactNo: string;
};

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TUserName;
  presentAddress: string;
  permanentAddress: string;
  gender: "male" | "female";
  dateOfBirth?: Date;
  contactNumber: string;
  email: string;
  avator?: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  guardian: TGuardian;
  profileImg?: string;
  academicSemester: Types.ObjectId;
  isDeleted: boolean;
  academicDepartment: Types.ObjectId;
};

// export type StudentMethods = {
//   isUserExist(id: string): Promise<TStudent | null>;
// };

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >;

// static methods -----------------------

export interface StudentModel extends Model<TStudent> {
  isUserExist(id: string): Promise<TStudent | null>;
}
