import { z } from "zod";

const createBranchValidation = z.object({
  body: z.object({
    name: z.string(),
    code: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string().optional(),
    country: z.string(),
    zipCode: z.string(),
    contactNumber: z.array(z.string()),
    email: z.string().email().optional(),
    managerName: z.string().optional(),
    openingSchedule: z.object({
      days: z.array(z.string()), // You can also add `.min(1)` if you want at least one day
      openTime: z.string(), // Consider stricter time validation with regex if needed
      closeTime: z.string(),
    }),
    branchOpenedAt: z.string().date().optional(),
  }),
});

const updateBranchValidation = z.object({
  body: z
    .object({
      name: z.string(),
      code: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string().optional(),
      country: z.string(),
      zipCode: z.string(),
      contactNumber: z.array(z.string()),
      email: z.string().email().optional(),
      managers: z.array(z.string()).optional(),
      services: z.array(z.string()).optional(),
      openingSchedule: z
        .object({
          days: z.array(z.string()).optional(), // You can also add `.min(1)` if you want at least one day
          openTime: z.string().optional(), // Consider stricter time validation with regex if needed
          closeTime: z.string().optional(),
          status: z.enum(["open", "closed"]).optional().default("open"),
        })
        .optional(),
      branchOpenedAt: z.string().date().optional(),
    })
    .partial(),
});

export const branchValidations = {
  createBranchValidation,
  updateBranchValidation,
};
