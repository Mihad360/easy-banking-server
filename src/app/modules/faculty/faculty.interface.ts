import { Model, Types } from "mongoose";

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  // role: string;
  designation: string;
  name: TUserName;
  gender: "male" | "female";
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

// export interface FacultyModels extends Model<TFaculty> {
//   isUserExists(id: string): Promise<TFaculty | null>;
// }
