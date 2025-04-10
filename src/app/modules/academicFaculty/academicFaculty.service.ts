import mongoose from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createAcademicFaculty = async (payload: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payload);
  return result;
};

const getAcademicFaculty = async (query: Record<string, unknown>) => {
  const academicFacultyQuery = new QueryBuilder(
    AcademicFacultyModel.find(),
    query,
  );
  const meta = await academicFacultyQuery.countTotal();
  const result = await academicFacultyQuery.modelQuery;
  return { meta, result };
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
