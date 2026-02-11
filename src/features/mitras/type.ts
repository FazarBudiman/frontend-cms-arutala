import { z } from "zod";

export const mitraSchema = z.object({
  mitra_id: z.string(),
  mitra_name: z.string(),
  business_field: z.array(z.string()),
  mitra_logo_url: z.string(),
});

export type Mitra = z.infer<typeof mitraSchema>;

export const mitrasSchema = z.array(mitraSchema);

export const createMitraSchema = z.object({
  mitraName: z.string(),
  businessField: z.array(z.object({ value: z.string().min(1) })),
  mitraLogo: z.instanceof(File, { message: "Profile wajib diisi" }).optional(),
});

export type CreateMitraInput = z.infer<typeof createMitraSchema>;
