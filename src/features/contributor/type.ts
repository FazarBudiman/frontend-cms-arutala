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
});

export type Contributor = z.infer<typeof contributorSchema>;
export const contributorsSchema = z.array(contributorSchema);

// Type Create Contributor
export const createContributorSchema = z.object({
  contributorName: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
  expertise: z
    .array(
      z.object({
        value: z.string().min(1),
      }),
    )
    .min(1, "Minimal 1 expertise"),
  profile: z.instanceof(File, { message: "Profile wajib diisi" }).optional(),
  // .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
  // .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
  contributorType: z.enum(Object.values(ContributorType) as [string, ...string[]]),
});

export type CreateContributorInput = z.infer<typeof createContributorSchema>;
