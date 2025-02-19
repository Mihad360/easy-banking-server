import mongoose from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";

const createAcademicFaculty = async (payload: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payload);
  return result;
};

const getAcademicFaculty = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};

const getEachAcademicFaculty = async (id: string) => {
  const result = await AcademicFacultyModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFaculty,
  getAcademicFaculty,
  getEachAcademicFaculty,
};
