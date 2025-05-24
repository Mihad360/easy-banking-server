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
    status: z.enum(["active", "closed", "suspended"]),
    branchCode: z.string(),
    accountHolderName: z.string(),
    interestRate: z.number().optional(),
    transactions: z.array(z.string()).optional(),
    minimumBalance: z.number().optional(),
  }),
});

export const accountValidations = {
  createAccountValidation,
};
