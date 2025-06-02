import { z } from "zod";

const loginValidation = z.object({
  body: z.object({
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    password: z.string(),
  }),
});

export const loginValidations = {
  loginValidation,
};
