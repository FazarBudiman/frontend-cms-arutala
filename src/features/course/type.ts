import { z } from "zod";
import { courseBatch, CourseBatchInput } from "../course-batch/type";

/* =========================================================
   ================== ENTITY / RESPONSE ====================
   ========================================================= */

/**
 * ---------------------------
 * COURSE BASE
 * ---------------------------
 */
export const courseSchema = z.object({
  course_id: z.string(),
  course_title: z.string(),
  course_description: z.string(),
  course_category_name: z.string(),
  course_field_name: z.string(),
});

export type Course = z.infer<typeof courseSchema>;

/**
 * ---------------------------
 * COURSE DETAIL (RESPONSE)
 * ---------------------------
 */
export const courseDetailSchema = z.object({
  course_id: z.string(),
  course_title: z.string(),
  course_description: z.string(),
  course_category_name: z.string(),
  course_field_name: z.string(),

  courseBenefit: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),

  courseMaterial: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),

  courseBatch: z.array(courseBatch),
});

export type CourseDetail = z.infer<typeof courseDetailSchema>;

/* =========================================================
   ======================= INPUT ===========================
   ========================================================= */

/**
 * ---------------------------
 * COURSE BENEFIT INPUT
 * ---------------------------
 */
const courseBenefitSchema = z.object({
  courseBenefitId: z.string().min(1, "Benefit tidak boleh kosong"),
  orderNum: z.number().int().positive().optional(),
});

/**
 * ---------------------------
 * COURSE MATERIAL INPUT
 * ---------------------------
 */
const courseMaterialSchema = z.object({
  title: z.string().min(5, "Title is required"),
  description: z.string().min(50, "Description is required"),
  orderNum: z.number().int().positive().optional(),
});

/**
 * ---------------------------
 * COURSE CREATE INPUT
 * ---------------------------
 */
export const courseInputSchema = z
  .object({
    courseTitle: z.string().min(5, "Title minimal 5 karakter").trim(),
    courseDescription: z.string().min(50, "Deskripsi minimal 50 karakter").trim(),

    courseCategoryId: z.string().min(1, "Category wajib dipilih").trim(),
    courseFieldId: z.string().min(1, "Field wajib dipilig"),

    courseBenefits: z
      .array(courseBenefitSchema)
      .min(1, "Minimal 1 Benefit")
      .refine(
        (benefits) => {
          const ids = benefits.map((b) => b.courseBenefitId);
          return new Set(ids).size === ids.length;
        },
        {
          message: "Duplicate benefit not allowed",
        },
      ),
    courseMaterials: z.array(courseMaterialSchema).min(1, "Minimal 1 Materials"),
  })
  .strict();

export type CourseInput = z.infer<typeof courseInputSchema>;

/* =========================================================
   ================= MASTER DATA ===========================
   ========================================================= */

export const courseCategory = z.object({
  id: z.string(),
  name: z.string(),
  min_duration: z.string(),
  max_duration: z.string(),
});

export type CourseCategory = z.infer<typeof courseCategory>;
export const coursesCategories = z.array(courseCategory);

export const courseField = z.object({
  id: z.string(),
  field: z.string(),
});

export type CourseField = z.infer<typeof courseField>;
export const coursesFields = z.array(courseField);

export const courseBenefit = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export type CourseBenefit = z.infer<typeof courseBenefit>;
export const coursesBenefit = z.array(courseBenefit);

/* =========================================================
   ================= UTIL MAPPING ==========================
   ========================================================= */

/**
 * Optional:
 * Mapping UI input -> backend payload (snake_case)
 */
export const mapCourseBatchInputToPayload = (data: CourseBatchInput) => ({
  batch_name: data.batchName,
  contributor_id: data.contributorId,

  registration_start: data.registrationStart,
  registration_end: data.registrationEnd,

  start_date: data.startDate,
  end_date: data.endDate,

  batch_status: data.batchStatus,

  sessions: data.batchSession.map((s) => ({
    topic: s.topic,
    date: s.sessionDate,
    start_time: s.sessionStartTime,
    end_time: s.sessionEndTime,
  })),

  base_price: data.batchPrice.basePrice,
  discount_type: data.batchPrice.discountType ?? null,
  discount_value: data.batchPrice.discountValue ?? null,
});
