import { z } from "zod";

const preRequisiteCourses = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string(),
      prefix: z.string(),
      code: z.string(),
      credits: z.number(),
      preRequisiteCourses: z.array(preRequisiteCourses).optional(),
      isDeleted: z.boolean().optional()
    }),
  }),
});

export const CourseValidations = {
    createCourseValidationSchema
}