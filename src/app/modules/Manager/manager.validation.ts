import { z } from "zod";

const createManagerValidation = z.object({
  body: z.object({
    managerId: z.string().optional(), // will be auto-generated
    user: z.string().optional(), // ObjectId as string
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
  }),
});

const updateManagerValidation = z.object({
  body: z
    .object({
      managerId: z.string(),
      user: z.string(),
      name: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }),
      email: z.string().email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      phoneNumber: z.string(),
      profilePhotoUrl: z.string(),
    })
    .partial(),
});
// Makes all top-level fields optional

export const managerValidations = {
  createManagerValidation,
  updateManagerValidation,
};
