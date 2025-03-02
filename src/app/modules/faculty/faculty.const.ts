import { Schema } from "mongoose";
import { TUserName } from "./faculty.interface";

export const facultyUserNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

export const facultySearch = [
  "email",
  "name.firstName",
  "name.lastName",
  "presentAddress",
];
