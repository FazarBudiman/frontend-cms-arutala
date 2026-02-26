import { z } from "zod";

export const mitraSchema = z.object({
  mitra_id: z.string(),
  mitra_name: z.string(),
  business_field: z.array(z.string()),
  mitra_logo_url: z.string(),
  is_displayed: z.boolean(),
});

export type Mitra = z.infer<typeof mitraSchema>;
export const mitrasSchema = z.array(mitraSchema);

// Type Create Mitra
export const createMitraSchema = z.object({
  mitraName: z.string().min(1, "Nama wajib diisi"),
  businessField: z.array(z.object({ value: z.string().min(1, "Business field tidak boleh kosong").trim() })).min(1, "Minimal 1 Business Field"),
  mitraLogo: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
});
export type CreateMitraInput = z.infer<typeof createMitraSchema>;

// Type update Mitra
export const updateMitraSchema = z.object({
  mitraName: z.string().min(1, "Nama wajib diisi"),
  businessField: z.array(z.object({ value: z.string().min(1, "Business field tidak boleh kosong").trim() })).min(1, "Minimal 1 Business Field"),
  mitraLogo: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .optional(),
  isDisplayed: z.boolean({
    error: "Status wajib diisi",
  }),
});
export type UpdateMitraInput = z.infer<typeof updateMitraSchema>;
