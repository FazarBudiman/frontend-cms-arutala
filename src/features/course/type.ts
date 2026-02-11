import { z } from "zod";

export const courseBatchPriceSchema = z.object({
  basePrice: z.string(),
  discountType: z.string(),
  discountValue: z.string(),
  finalPrice: z.string(),
});

export const courseBatchSchema = z.object({
  name: z.string(),
  status: z.string(),
  posterUrl: z.string(),
  registration_start: z.string(),
  registration_end: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  instructor: z.object({
    name: z.string(),
    jobTitle: z.string(),
    companyName: z.string(),
    profileUrl: z.string(),
  }),
  price: courseBatchPriceSchema,
});

export const courseSchema = z.object({
  course_id: z.string(),
  course_title: z.string(),
  course_description: z.string(),
  course_category_name: z.string(),
  course_field_name: z.string(),
  course_batch: courseBatchSchema,
});

export type Course = z.infer<typeof courseSchema>;
