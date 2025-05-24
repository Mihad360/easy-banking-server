import { z } from "zod";

const loginValidation = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const loginValidations = {
  loginValidation,
};
