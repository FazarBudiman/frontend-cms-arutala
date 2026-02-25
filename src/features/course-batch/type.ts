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

export const courseBatchStatusEnum = z.enum(Object.values(CourseBatchStatus) as [string, ...string[]]);

export type CourseBatchStatus = z.infer<typeof courseBatchStatusEnum>;

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

  sessionDate: z.string().regex(dateRegex, "Tanggal session harus diisi"),

  sessionStartTime: z.string().regex(timeRegex, "Jam mulai session harus diisi"),

  sessionEndTime: z.string().regex(timeRegex, "Jam selesai session harus diisi"),
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

    contributorId: z.string().uuid("Contributor harus diisi"),

    registrationStart: z.string().regex(dateRegex, "Tanggal mulai registrasi harus diisi"),

    registrationEnd: z.string().regex(dateRegex, "Tanggal akhir registrasi harus diisi"),

    startDate: z.string().regex(dateRegex, "Tanggal mulai batch harus diisi"),

    endDate: z.string().regex(dateRegex, "Tanggal akhir batch harus diisi"),

    batchStatus: z.enum(Object.values(CourseBatchStatus) as [string, ...string[]], {
      error: "Status batch harus diisi",
    }),

    batchSession: z.array(courseBatchSessionInputSchema).min(1, "Minimal 1 session"),

    batchPrice: courseBatchPriceInputSchema,
  })
  .strict();

export type CourseBatchInput = z.infer<typeof courseBatchInputSchema>;
