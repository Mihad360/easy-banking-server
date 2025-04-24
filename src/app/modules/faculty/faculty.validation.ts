import { z } from "zod";

const facultyNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: "First name cannot exceed 20 characters" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .max(20, { message: "First name cannot exceed 20 characters" }),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    passoword: z.string().optional(),
    faculty: z.object({
      designation: z.string().min(1, "Designation is required"),
      name: facultyNameValidationSchema,
      gender: z.enum(["male", "female"], {
        message: "Gender is required",
      }),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
      presentAddress: z.string().min(1, "Present address is required"),
      permanentAddress: z.string().min(1, "Permanent address is required"),
      academicDepartment: z.string(),
      academicFaculty: z.string(),
    }),
  }),
});

export const facultyValidation = {
  createFacultyValidationSchema,
};
