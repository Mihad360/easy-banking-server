/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from "mongoose";
import {
  TGuardian,
  TUserName,
  TStudent,
  StudentModel,
} from "./student.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  contactNo: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, "password is required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "user is required"],
      unique: true,
      ref: "User",
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    profileImg: { type: String, default: "" },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    academicSemester: { type: Schema.Types.ObjectId, ref: "AcademicSemester" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
    },
    // academicFaculty: {
    //   type: Schema.Types.ObjectId,
    //   ref: "AcademicFaculty",
    // },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

studentSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("aggregate", async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

studentSchema.virtual("fullName").get(function (next) {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
  next();
});

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
