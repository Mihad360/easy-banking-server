import { Student } from "./student.model";



const getAllStudent = async () => {
  const result = await Student.find();
  return result;
};

const getEachStudent = async (id: string) => {
  // const result = await Student.findOne({id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteEachStudent = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  getAllStudent,
  getEachStudent,
  deleteEachStudent,
};
