import { z } from "zod";
import { Days } from "./offeredCourse.const";

const timeStringSchema = z.string().refine(
  (time) => {
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },
  {
    message: "Invalid type of Start Time, Expected HH:MM Time format",
  },
);

const offeredCourseValidationSchema = z.object({
  body: z
    .object({
      academicSemester: z.string().optional(),
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`2005-11-07T${body.startTime}:00`);
        const end = new Date(`2005-11-07T${body.endTime}:00`);
        return end > start;
      },
      {
        message: "The Start time should be before End Time",
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`2005-11-07T${body.startTime}:00`);
        const end = new Date(`2005-11-07T${body.endTime}:00`);
        return end > start;
      },
      {
        message: "The Start time should be before End Time",
      },
    ),
});

export const offeredCourseValidations = {
  offeredCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
