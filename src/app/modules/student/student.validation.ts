import { z } from "zod";

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: "First name cannot exceed 20 characters" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .max(20, { message: "First name cannot exceed 20 characters" }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().nonempty({ message: "Father's name is required" }),
  motherName: z.string().nonempty({ message: "Mother's name is required" }),
  fatherOccupation: z
    .string()
    .nonempty({ message: "Father's occupation is required" }),
  motherOccupation: z
    .string()
    .nonempty({ message: "Mother's occupation is required" }),
  contactNo: z.string().nonempty({ message: "Contact number is required" }),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6).max(12).optional(),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(["male", "female"], {
        message: "Gender is required",
      }),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNumber: z.string().min(11),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
      // profileImg: z.string().optional(),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      academicSemester: z.string(),
      guardian: guardianValidationSchema,
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: "First name cannot exceed 20 characters" })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .max(20, { message: "First name cannot exceed 20 characters" })
    .optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z
    .string()
    .optional(),
  motherName: z
    .string()
    .optional(),
  fatherOccupation: z
    .string()
    .optional(),
  motherOccupation: z
    .string()
    .optional(),
  contactNo: z
    .string()
    .optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    // password: z.string().min(6).max(12).optional(),
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
      gender: z
        .enum(["male", "female"], {
          message: "Gender is required",
        })
        .optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNumber: z.string().min(11).optional(),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
      profileImg: z.string().optional(),
      presentAddress: z.string().min(1).optional(),
      permanentAddress: z.string().min(1).optional(),
      admissionSemester: z.string().optional(),
      guardian: updateGuardianValidationSchema.optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
