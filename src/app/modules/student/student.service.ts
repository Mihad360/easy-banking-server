import { Student } from "../student.model";
import { TStudent } from "./student.interface";

const createStudentDB = async (studentData: TStudent) => {
  // const student = new Student(studentData);
  // if (await student.isUserExist(studentData.id)) {
  //   throw new Error("User already exists");
  // }
  // const result = await student.save();
  if (await Student.isUserExist(studentData.id)) {
    throw new Error("User already exists");
  }
  const result = await Student.create(studentData);
  return result;
};

const getAllStudent = async () => {
  const result = await Student.find();
  return result;
};

const getEachStudent = async (id: string) => {
  // const result = await Student.findOne({id });
  const result = await Student.aggregate([
    {$match: {id: id}}
  ])
  return result;
};

const deleteEachStudent = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  createStudentDB,
  getAllStudent,
  getEachStudent,
  deleteEachStudent,
};
