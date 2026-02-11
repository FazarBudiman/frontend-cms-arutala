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
});

export type Testimoni = z.infer<typeof testimoniSchema>;
export const testmoniesSchema = z.array(testimoniSchema);

// Type Create Contributor
export const createTestimoniSchema = z.object({
  authorName: z.string(),
  authorJobTitle: z.string(),
  authorCompanyName: z.string(),
  testimoniContent: z.string(),
  testimoniCategory: z.enum(Object.values(TestimoniType) as [string, ...string[]]),
  authorProfile: z.instanceof(File, { message: "Profile wajib diisi" }).optional(),
  // .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
  // .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
});

export type CreateTestimoniInput = z.infer<typeof createTestimoniSchema>;
