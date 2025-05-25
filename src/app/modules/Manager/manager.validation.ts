import { z } from "zod";

const createManagerValidation = z.object({
  managerId: z.string().optional(), // will be auto-generated
  user: z.string({ required_error: "User ID is required" }), // ObjectId as string
  name: z.object({
    firstName: z.string({ required_error: "First name is required" }),
    lastName: z.string({ required_error: "Last name is required" }),
  }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string({ required_error: "Phone number is required" }),
  profilePhotoUrl: z.string().optional(),
});

export const managerValidations = {
  createManagerValidation,
};
