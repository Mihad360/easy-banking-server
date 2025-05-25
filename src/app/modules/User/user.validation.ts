import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    customerId: z.string().optional(),
    managerId: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string().optional(),
  }),
});

export const userValidations = {
  createUserValidation,
};
