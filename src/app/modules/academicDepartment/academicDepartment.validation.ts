import { z } from "zod";

const academicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Academic Department is Required" }),
    academicFaculty: z.string({
      required_error: "Academic Faculty is Required",
    }),
  }),
});

const updateacademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Academic Department is Required" })
      .optional(),
    academicFaculty: z
      .string({
        required_error: "Academic Faculty is Required",
      })
      .optional(),
  }),
});

export const academicDepartmentValidation = {
  academicDepartmentValidationSchema,
  updateacademicDepartmentValidationSchema,
};
