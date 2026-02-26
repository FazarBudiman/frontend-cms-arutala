import { z } from "zod";

export const TestimoniType = {
  SISWA: "SISWA",
  TALENT: "TALENT",
};

export const testimoniSchema = z.object({
  testimoni_id: z.string(),
  author_name: z.string(),
  author_job_title: z.string(),
  author_company_name: z.string(),
  testimoni_content: z.string(),
  author_profile_url: z.string(),
  testimoni_category: z.enum(Object.values(TestimoniType) as [string, ...string[]]),
  is_displayed: z.boolean(),
});

export type Testimoni = z.infer<typeof testimoniSchema>;
export const testmoniesSchema = z.array(testimoniSchema);

// Type Create Contributor
export const createTestimoniSchema = z.object({
  authorName: z.string().min(1, "Author name wajib diisi").trim(),
  authorJobTitle: z.string().min(1, "Job Title wajib diisi").trim(),
  authorCompanyName: z.string().min(1, "Company name wajib diisi").trim(),
  testimoniContent: z.string().min(2, "Content wajib diisi").trim(),
  testimoniCategory: z.enum(Object.values(TestimoniType) as [string, ...string[]], {
    error: "Category wajib dipilih",
  }),
  authorProfile: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
});
export type CreateTestimoniInput = z.infer<typeof createTestimoniSchema>;

export const updateTestimoniSchema = z.object({
  authorName: z.string().min(1, "Author name wajib diisi").trim(),
  authorJobTitle: z.string().min(1, "Job Title wajib diisi").trim(),
  authorCompanyName: z.string().min(1, "Company name wajib diisi").trim(),
  testimoniContent: z.string().min(2, "Content wajib diisi").trim(),
  testimoniCategory: z.enum(Object.values(TestimoniType) as [string, ...string[]], {
    error: "Category wajib dipilih",
  }),
  authorProfile: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .optional(),
  isDisplayed: z.boolean(),
});

export type UpdateTestimoniInput = z.infer<typeof updateTestimoniSchema>;
