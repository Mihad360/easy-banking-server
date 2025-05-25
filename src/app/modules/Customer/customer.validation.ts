import { z } from "zod";

export const createCustomerValidation = z.object({
  body: z.object({
    //   customerId: z.string().optional(), // auto-generated
    // user: z.string(), // MongoDB ObjectId as string
    name: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
    }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"), // you can adjust the rules
    phoneNumber: z.string().min(1, "Phone number is required"),
    profilePhotoUrl: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const customerValidations = {
    createCustomerValidation
}