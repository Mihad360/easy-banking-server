import { z } from "zod";

const SemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z.enum(["UPCOMING", "ONGOING", "ENDED"]),
    startDate: z.string(),
    endDate: z.string(),
    minCredit: z.number().min(1, "Minimum credit must be at least 1"),
    maxCredit: z.number().min(1, "Maximum credit must be at least 1"),
  }),
});

const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z.enum(["UPCOMING", "ONGOING", "ENDED"]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z
      .number()
      .min(1, "Minimum credit must be at least 1")
      .optional(),
    maxCredit: z
      .number()
      .min(1, "Maximum credit must be at least 1")
      .optional(),
  }),
});

export const semesterValidations = {
  SemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
