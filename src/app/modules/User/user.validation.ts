import { z } from "zod";

const userNameValidation = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

const createUserValidation = z.object({
  body: z.object({
    name: userNameValidation,
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string(),
    address: z.string(),
    phoneNumber: z.string(),
  }),
});

export const userValidations = {
  createUserValidation,
};
