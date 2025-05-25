import { z } from "zod";

export const createAccountValidation = z.object({
  body: z.object({
    accountNumber: z.string().optional(),
    user: z.string(), // ObjectId as string
    customer: z.string(),
    branch: z.string(),
    accountType: z.enum(["savings", "checking", "business"]),
    balance: z.number().default(0),
    currency: z.string(),
    status: z.enum(["pending", "active", "closed", "suspended"]).optional(),
    branchCode: z.string(),
    accountHolderName: z.string(),
    interestRate: z.number().optional(),
    transactions: z.array(z.string()).optional(),
    minimumBalance: z.number().optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"), // optionally use regex or date parsing
    gender: z.enum(["Male", "Female", "Other"]),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
});

export const accountValidations = {
  createAccountValidation,
};
