import z from "zod";

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
  instructor_id: z.string().optional(),

  base_price: z.number(),
  discount_type: z.string(),
  discount_value: z.number(),
  final_price: z.number(),

  sessions: z.optional(z.array(courseSessions)),
});

export type CourseBatch = z.infer<typeof courseBatch>;

/* =========================================================
   ================= COURSE BATCH INPUT ====================
   ========================================================= */

/**
 * ---------------------------
 * BATCH STATUS
 * ---------------------------
 */
export const CourseBatchStatus = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  OPEN: "OPEN",
  ON_GOING: "ON_GOING",
  COMPLETED: "COMPLETED",
} as const;

/**
 * ---------------------------
 * REGEX HELPERS
 * ---------------------------
 */
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * ---------------------------
 * SESSION INPUT
 * ---------------------------
 */
export const courseBatchSessionInputSchema = z.object({
  topic: z.string().min(5, "Topik session minimal 5 karakter").max(255, "Topik session maksimal 255 karakter"),

  sessionDate: z.string().regex(dateRegex, "Format sessionDate harus YYYY-MM-DD"),

  sessionStartTime: z.string().regex(timeRegex, "Format sessionStartTime harus HH:mm (00:00 - 23:59)"),

  sessionEndTime: z.string().regex(timeRegex, "Format sessionEndTime harus HH:mm (00:00 - 23:59)"),
});

/**
 * ---------------------------
 * PRICE INPUT
 * ---------------------------
 */

export const courseBatchPriceInputSchema = z.object({
  basePrice: z
    .number({
      error: "Base price harus berupa angka",
    })
    .min(1, "Harga dasar harus lebih dari 0"),

  discountType: z.enum(["PERCENT", "FIXED"]).optional(),

  discountValue: z
    .number({
      error: "Discount value harus berupa angka",
    })
    .min(1, "Harga dasar harus lebih dari 0")
    .optional(),
  finalPrice: z
    .number({
      error: "Final price harus berupa angka",
    })
    .optional(),
});

/**
 * ---------------------------
 * COURSE BATCH CREATE INPUT
 * ---------------------------
 */
export const courseBatchInputSchema = z
  .object({
    batchName: z.string().min(5, "Nama batch minimal 5 karakter").max(255, "Nama batch maksimal 255 karakter"),

    contributorId: z.string().uuid("Format contributorId harus UUID"),

    registrationStart: z.string().regex(dateRegex, "Format registrationStart harus YYYY-MM-DD"),

    registrationEnd: z.string().regex(dateRegex, "Format registrationEnd harus YYYY-MM-DD"),

    startDate: z.string().regex(dateRegex, "Format startDate harus YYYY-MM-DD"),

    endDate: z.string().regex(dateRegex, "Format endDate harus YYYY-MM-DD"),

    batchStatus: z.enum(Object.values(CourseBatchStatus) as [string, ...string[]], {
      error: "Batch status tidak valid",
    }),

    batchSession: z.array(courseBatchSessionInputSchema).min(1, "Minimal 1 session"),

    batchPrice: courseBatchPriceInputSchema,
  })
  .strict();

export type CourseBatchInput = z.infer<typeof courseBatchInputSchema>;
