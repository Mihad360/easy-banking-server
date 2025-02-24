import HttpStatus from 'http-status';
import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../erros/AppError";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, required: true, unique: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: "AcademicFaculty" },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre("save", async function (next) {
  const isDepartmentExist = await academicDepartmentModel.findOne({
    name: this.name,
  });
  if (isDepartmentExist) {
    throw new AppError(HttpStatus.NOT_FOUND,"the department is already exist");
  }
  next();
});

academicDepartmentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  const isDepartmentExist = await academicDepartmentModel.findOne({ query });
  if (!isDepartmentExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "this department does not exist");
  }
  next();
});

export const academicDepartmentModel = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema,
);
