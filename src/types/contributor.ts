import { z } from "zod";

export const contributorSchema = z.object({
  contributor_id: z.string(),
  contributor_name: z.string(),
  contributor_job_title: z.string(),
  contributor_company_name: z.string(),
  contributor_expertise: z.array(z.string()),
  contributor_profile_url: z.string(),
});

export type Contributor = z.infer<typeof contributorSchema>;
export const contributorsSchema = z.array(contributorSchema);
