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
    dateOfBirth: z.string().min(1, "Date of birth is required"), // optionally use regex or date parsing
    gender: z.enum(["Male", "Female", "Other"]),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    profilePhotoUrl: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const customerValidations = {
    createCustomerValidation
}