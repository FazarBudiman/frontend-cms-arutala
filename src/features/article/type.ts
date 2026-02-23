import { z } from "zod";

export const ArticleStatus = {
  DRAFT: "DRAFT",
  REVIEW: "REVIEW",
  PUBLISHED: "PUBLISHED",
  UNPUBLISHED: "UNPUBLISHED",
} as const;

export const articleStatusEnum = z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "REVIEW"]);
export type ArticleStatusType = z.infer<typeof articleStatusEnum>

export const articleSchema = z.object({
  article_id: z.string(),
  article_title: z.string(),
  article_cover_url: z.string(),
  article_status: articleStatusEnum,
  created_date: z.string(),
  full_name: z.string(),
});

export type Article = z.infer<typeof articleSchema>;

export interface ParagraphBlockData {
  text: string;
}

export interface HeaderBlockData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ImageBlockData {
  file: { url: string };
  caption?: string;
  stretched?: boolean;
  withBorder?: boolean;
  withBackground?: boolean;
}

export interface ListItem {
  content: string;
  items: ListItem[];
}

export interface ListBlockData {
  style: "ordered" | "unordered";
  items: (string | ListItem)[];
}

export interface CodeBlockData {
  code: string;
  language?: string;
}

export interface QuoteBlockData {
  text: string;
  caption?: string;
  alignment?: "left" | "center" | "right";
}

export interface ChecklistItem {
  text: string;
  checked: boolean;
}

export interface ChecklistBlockData {
  items: ChecklistItem[];
}

export type DelimiterBlockData = Record<string, never>;

export const ContentBlock = z.union([
  z.object({ id: z.string().optional(), type: z.literal("paragraph"), data: z.object({ text: z.string() }) }),
  z.object({ id: z.string().optional(), type: z.literal("header"), data: z.object({ text: z.string(), level: z.number().min(1).max(6) }) }),
  z.object({
    id: z.string().optional(),
    type: z.literal("image"),
    data: z.object({ file: z.object({ url: z.string() }), caption: z.string().optional(), stretched: z.boolean().optional(), withBorder: z.boolean().optional(), withBackground: z.boolean().optional() }),
  }),
  z.object({
    id: z.string().optional(),
    type: z.literal("list"),
    data: z.object({
      style: z.enum(["ordered", "unordered"]),
      items: z.array(z.union([z.string(), z.lazy(() => z.object({ content: z.string(), items: z.array(z.any()) }))])),
    }),
  }),
  z.object({ id: z.string().optional(), type: z.literal("code"), data: z.object({ code: z.string(), language: z.string().optional() }) }),
  z.object({ id: z.string().optional(), type: z.literal("quote"), data: z.object({ text: z.string(), caption: z.string().optional(), alignment: z.enum(["left", "center", "right"]).optional() }) }),
  z.object({
    id: z.string().optional(),
    type: z.literal("checklist"),
    data: z.object({
      items: z.array(z.object({ text: z.string(), checked: z.boolean() })),
    }),
  }),
  z.object({ id: z.string().optional(), type: z.literal("delimiter"), data: z.object({}).optional() }),
]);

export type ContentBlockType = z.infer<typeof ContentBlock>;

export const articleDetailSchema = z.object({
  article_id: z.string(),
  article_title: z.string(),
  article_cover_url: z.string(),
  article_content_blocks: z.array(ContentBlock),
  article_cover_description: z.string(),
  article_content_text: z.string(),
  article_status: articleStatusEnum,
  created_date: z.string(),
  full_name: z.string(),
});

export type ArticleDetail = z.infer<typeof articleDetailSchema>;

export const articleCoverInputSchema = z.object({
  cover_description: z.string().min(20, "Cover description must be at least 20 characters"),
  cover_image: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
});

export type ArticleCoverInputType = z.infer<typeof articleCoverInputSchema>;


export const articleCoverInputUpdateSchema = z.object({
  cover_description: z.string().min(20, "Cover description must be at least 20 characters").optional(),
  cover_image: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .optional(),
});

export type ArticleCoverInputUpdateType = z.infer<typeof articleCoverInputUpdateSchema>;

export const articleInputSchema = z.object({
  contentBlocks: z.array(ContentBlock),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
