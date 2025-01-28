/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from "mongoose";
import {
  TGuardian,
  StudentMethods,
  TUserName,
  TStudent,
  StudentModel,
} from "./student/student.interface";
import bcrypt from "bcrypt";
import config from "../config";

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

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: [true, "password is required"], unique: true },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 12,
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
  dateOfBirth: String,
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  profileImg: { type: String },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: {
    type: guardianSchema,
    required: true,
  },
  isActive: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{
  toJSON: {
    
    virtuals: true
  }
});

studentSchema.pre("save", async function (next) {
  const user = this;
  // console.log(this, "we will save the data");
  // hashing password----------------------
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

studentSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

studentSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
  // console.log(this);
});

// studentSchema.pre("findOne", async function (next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
//   // console.log(this);
// });

studentSchema.pre("aggregate", async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
  // console.log(this);
});

studentSchema.virtual("fullName").get(function (next) {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
  next();
});

// studentSchema.methods.isUserExist = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
