import { z } from "zod";

export const ContributorType = {
  INTERNAL: "INTERNAL",
  EXTERNAL: "EXTERNAL",
};

export const contributorSchema = z.object({
  contributor_id: z.string(),
  contributor_name: z.string(),
  contributor_job_title: z.string(),
  contributor_company_name: z.string(),
  contributor_expertise: z.array(z.string()),
  contributor_profile_url: z.string(),
  contributor_type: z.enum(Object.values(ContributorType) as [string, ...string[]]),
  is_displayed: z.boolean(),
});

export type Contributor = z.infer<typeof contributorSchema>;
export const contributorsSchema = z.array(contributorSchema);

// Type Create Contributor
export const createContributorSchema = z.object({
  contributorName: z.string().min(1, "Nama wajib diisi").trim(),
  jobTitle: z.string().min(1, "Job title wajib diisi").trim(),
  companyName: z.string().min(1, "Company name wajib diisi").trim(),
  expertise: z
    .array(
      z.object({
        value: z.string().min(1, "Expertise tidak boleh kosong").trim(),
      }),
    )
    .min(1, "Minimal 1 expertise"),
  contributorType: z.enum(Object.values(ContributorType) as [string, ...string[]], {
    error: "Type wajib dipilih",
  }),
  profile: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
});
export type CreateContributorInput = z.infer<typeof createContributorSchema>;

// Type update Contributor
export const updateContributorSchema = z.object({
  contributorName: z.string().min(1, "Nama wajib diisi").trim(),
  jobTitle: z.string().min(1, "Job title wajib diisi").trim(),
  companyName: z.string().min(1, "Company name wajib diisi").trim(),
  expertise: z
    .array(
      z.object({
        value: z.string().min(1, "Expertise tidak boleh kosong").trim(),
      }),
    )
    .min(1, "Minimal 1 expertise"),
  contributorType: z.enum(Object.values(ContributorType) as [string, ...string[]], {
    error: "Type wajib dipilih",
  }),
  profile: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .optional(),
  isDisplayed: z.boolean(),
});
export type UpdateContributorInput = z.infer<typeof updateContributorSchema>;
