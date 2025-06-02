import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    // customerId: z.string().optional(),
    // managerId: z.string().optional(),
    name: z.object({
      firstName: z.string({ required_error: "First name is required" }),
      lastName: z.string({ required_error: "Last name is required" }),
    }),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string().optional(),
    profilePhotoUrl: z.string().optional(),
    phoneNumber: z.string(),
  }),
});

export const userValidations = {
  createUserValidation,
};
