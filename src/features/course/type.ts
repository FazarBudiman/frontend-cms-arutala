import { z } from "zod";

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
 * COURSE SESSION (RESPONSE)
 * ---------------------------
 */
export const courseSessions = z.object({
  course_session_id: z.string(),
  topic: z.string(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
});

export type CourseSession = z.infer<typeof courseSessions>;

/**
 * ---------------------------
 * COURSE BATCH (RESPONSE)
 * ---------------------------
 */
export const courseBatch = z.object({
  course_batch_id: z.string(),
  name: z.string(),
  status: z.string(),
  poster_url: z.string(),

  registration_start: z.string(),
  registration_end: z.string(),

  start_date: z.string(),
  end_date: z.string(),

  batch_status: z.string(),

  instructor_name: z.string(),
  instructor_job_title: z.string(),
  instructor_company_name: z.string(),
  instructor_profile_url: z.string(),

  base_price: z.number(),
  discount_type: z.string(),
  discount_value: z.number(),
  final_price: z.number(),

  sessions: z.optional(z.array(courseSessions)),
});

export type CourseBatch = z.infer<typeof courseBatch>;

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
  courseBenefitId: z.string().uuid(),
  orderNum: z.number().int().positive(),
});

/**
 * ---------------------------
 * COURSE MATERIAL INPUT
 * ---------------------------
 */
const courseMaterialSchema = z.object({
  title: z.string().min(5, "Title is required"),
  description: z.string().min(50, "Description is required"),
  orderNum: z.number().int().positive(),
});

/**
 * ---------------------------
 * COURSE CREATE INPUT
 * ---------------------------
 */
export const courseInputSchema = z
  .object({
    courseTitle: z.string().min(5, "Title minimal 5 karakter"),
    courseDescription: z.string().min(50, "Deskripsi minimal 50 karakter"),

    courseCategoryId: z.string().uuid(),
    courseFieldId: z.string().uuid(),

    courseBenefits: z.array(courseBenefitSchema),
    courseMaterials: z.array(courseMaterialSchema),
  })
  .strict();

export type CourseInput = z.infer<typeof courseInputSchema>;

/* =========================================================
   ================= COURSE BATCH INPUT ====================
   ========================================================= */

/**
 * ---------------------------
 * BATCH SESSION INPUT
 * (sesuai payload kamu)
 * ---------------------------
 */
export const courseBatchSessionInputSchema = z.object({
  topic: z.string().min(5, "Topic minimal 5 karakter"),
  sessionDate: z.string(),
  sessionStartTime: z.string(),
  sessionEndTime: z.string(),
});

/**
 * ---------------------------
 * BATCH PRICE INPUT
 * ---------------------------
 */
export const courseBatchPriceInputSchema = z.object({
  basePrice: z.number().min(0),
  discountType: z.string().optional(),
  discountValue: z.number().optional(),
});

/**
 * ---------------------------
 * COURSE BATCH CREATE INPUT
 * ---------------------------
 */

export const CourseBatchStatus = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  OPEN: "OPEN",
  ON_GOING: "ON_GOING",
  COMPLETED: "COMPLETED",
} as const;

export const courseBatchInputSchema = z
  .object({
    batchName: z.string().min(3, "Nama batch minimal 3 karakter"),
    contributorId: z.string().uuid(),

    registrationStart: z.string(),
    registrationEnd: z.string(),

    startDate: z.string(),
    endDate: z.string(),

    batchStatus: z.enum(Object.values(CourseBatchStatus) as [string, ...string[]]),

    batchSession: z.array(courseBatchSessionInputSchema).min(1, "Minimal 1 session"),

    batchPrice: courseBatchPriceInputSchema,
  })
  .strict();

export type CourseBatchInput = z.infer<typeof courseBatchInputSchema>;

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
