import z from "zod";

export const seoSchema = z.object({
  seo_id: z.string(),
  meta_title: z.string().min(3, "Meta Title wajib diisi"),
  meta_description: z.string().min(15, "Meta Description minimal 15 karakter"),
  is_active: z.boolean(),
});

export type Seo = z.infer<typeof seoSchema>;
export const seosSchema = z.array(seoSchema);

export const seoInputSchema = z.object({
  metaTitle: z.string().min(3, "Meta Title wajib diisi"),
  metaDescription: z.string().min(15, "Meta Description minimal 15 karakter"),
});

export type SeoInput = z.infer<typeof seoInputSchema>;
