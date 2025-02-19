import mongoose from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { academicDepartmentModel } from "./academicDepartment.model";

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
  const result = await academicDepartmentModel.create(payload);
  return result;
};

const getAcademicDepartment = async () => {
  const result = await academicDepartmentModel.find();
  return result;
};

const getEachAcademicDepartment = async (id: string) => {
  const result = await academicDepartmentModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  return result;
};

const updateEachAcademicDepartment = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await academicDepartmentModel.findOneAndUpdate(
    {
      _id: id,
    },
    payload,
    { new: true },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartment,
  getAcademicDepartment,
  getEachAcademicDepartment,
  updateEachAcademicDepartment,
};
