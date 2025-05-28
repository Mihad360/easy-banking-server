import { z } from "zod";

const createTransactionSchema = z.object({
  body: z.object({
    account: z.string().min(1, "Account number is required"),
    user: z.string().optional(),
    transaction_Id: z.string().optional(),

    transactionType: z.enum(["deposit", "withdraw", "transfer"]),
    amount: z.number().positive("Amount must be greater than 0"),

    fromAccount: z.string().optional(),
    toAccount: z.string().optional(),

    status: z.enum(["pending", "completed", "failed"]).optional(),
    description: z.string().optional(),
  }),
});

export const transactionValidations = {
  createTransactionSchema,
};
