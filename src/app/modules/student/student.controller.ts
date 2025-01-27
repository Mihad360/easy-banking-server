import { Request, Response } from "express";
import { StudentServices } from "./student.service";
import studentValidationSchema from "./student.validation";

const createStudent = async (req: Request, res: Response) => {
  try {

    const { student: studentData } = req.body;

    // ----------- using Joi ----------
    // const { error , value} = studentValidationSchema.validate(studentData);

    // ------------using Zod ------------------
    const zodValidationParser = studentValidationSchema.parse(studentData)

    const result = await StudentServices.createStudentDB(zodValidationParser);

    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: "error",
    //     error: error,
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "student created successfully",
      data: result,
    });
  } catch (error : any) {
    res.status(500).json({
      success: false,
      message: error.message || "error",
      error: error,
    });
  }
};

const getStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudent();
    res.status(200).json({
      success: true,
      message: "student retrieve successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "error",
      error: error,
    });
  }
};

const getEachStudentId = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const result = await StudentServices.getEachStudent(studentId);
    res.status(200).json({
      success: true,
      message: "student got successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "error",
      error: error,
    });
  }
};

const deleteEachStudentId = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const result = await StudentServices.deleteEachStudent(studentId);
    res.status(200).json({
      success: true,
      message: "student deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "error",
      error: error,
    });
  }
};

export const StudentControllers = {
  createStudent,
  getStudent,
  getEachStudentId,
  deleteEachStudentId
};
