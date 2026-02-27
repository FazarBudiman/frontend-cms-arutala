import z from "zod";

export const pageSchema = z.object({
  page_id: z.string(),
  page_title: z.string(),
  page_slug: z.string(),
  parent_page_title: z.string().nullable(),
  seo_status: z.enum(["NO_SEO", "INACTIVE", "ACTIVE"]),
});

export type Page = z.infer<typeof pageSchema>;
export const pagesSchema = z.array(pageSchema);
