import { z } from "zod";
import { BloodGroup, Gender } from "./admin.const";

export const userNameSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(20, "Name cannot be more than 20 characters")
    .trim(),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .max(20, "Name cannot be more than 20 characters")
    .trim(),
});

export const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    admin: z.object({
      id: z.string().min(1, "ID is required"),
      designation: z.string().min(1, "Designation is required"),
      name: userNameSchema,
      gender: z.enum([...Gender] as [string, ...string[]]),

      dateOfBirth: z.string().optional(),
      email: z.string().email("Invalid email").min(1, "Email is required"),
      contactNo: z.string().min(1, "Contact number is required"),
      emergencyContactNo: z
        .string()
        .min(1, "Emergency contact number is required"),
      bloogGroup: z.enum([...BloodGroup] as [string, ...string[]]),
      presentAddress: z.string().min(1, "Present address is required"),
      permanentAddress: z.string().min(1, "Permanent address is required"),
      managementDepartment: z.string(),
      profileImg: z.string().optional(),
      isDeleted: z.boolean(),
    }),
  }),
});
const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(3).max(20).optional(),
  middleName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

export const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: updateUserNameValidationSchema.optional(),
      designation: z.string().max(30).optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloogGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
    }),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
