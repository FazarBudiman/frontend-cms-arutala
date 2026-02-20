import { z } from 'zod';

export const ArticleStatus = {
  DRAFT: "DRAFT",
  REVIEW: "REVIEW",
  PUBLISHED: "PUBLISHED",
  UNPUBLISHED: "UNPUBLISHED",
} as const;

export type ArticleStatusType = keyof typeof ArticleStatus;

export const articleSchema = z.object({
  article_id: z.string(),
  article_title: z.string(),
  article_cover_url: z.string().nullable().optional(),
  article_cover_description: z.string().nullable().optional(),
  article_status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "UNPUBLISHED"]),
  created_date: z.string(),
  full_name: z.string(),
});

export type Article = z.infer<typeof articleSchema>;

export interface ParagraphBlockData {
    text: string
}

export interface HeaderBlockData {
    text: string
    level: 1 | 2 | 3 | 4 | 5 | 6
}

export interface ImageBlockData {
    file: { url: string }
    caption?: string
    stretched?: boolean
    withBorder?: boolean
    withBackground?: boolean
}

export interface ListBlockData {
    style: 'ordered' | 'unordered'
    items: string[]
}

export interface CodeBlockData {
    code: string
    language?: string
}

export interface QuoteBlockData {
    text: string
    caption?: string
    alignment?: 'left' | 'center' | 'right'
}

export const ContentBlock = z.union([
    z.object({ id: z.string(), type: z.literal('paragraph'), data: z.object({ text: z.string() }) }),
    z.object({ id: z.string(), type: z.literal('header'), data: z.object({ text: z.string(), level: z.enum(['1', '2', '3', '4', '5', '6']) }) }),
    z.object({ id: z.string(), type: z.literal('image'), data: z.object({ file: z.object({ url: z.string() }), caption: z.string().optional(), stretched: z.boolean().optional(), withBorder: z.boolean().optional(), withBackground: z.boolean().optional() }) }),
    z.object({ id: z.string(), type: z.literal('list'), data: z.object({ style: z.enum(['ordered', 'unordered']), items: z.array(z.string()) }) }),
    z.object({ id: z.string(), type: z.literal('code'), data: z.object({ code: z.string(), language: z.string().optional() }) }),
    z.object({ id: z.string(), type: z.literal('quote'), data: z.object({ text: z.string(), caption: z.string().optional(), alignment: z.enum(['left', 'center', 'right']).optional() }) }),
]);

export const articleDetailSchema = z.object({
    article_id: z.string(),
    article_title: z.string(),
    article_cover_url: z.string().nullable().optional(),
    article_content_blocks: z.array(ContentBlock),
    article_content_text: z.string(),
    article_status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "UNPUBLISHED"]),
    article_cover_description: z.string().nullable().optional(),
    created_date: z.string(),
    full_name: z.string(),
});

export type ArticleDetail = z.infer<typeof articleDetailSchema>;

// POST /article/ — only contentBlocks required (minItems: 1)
export type CreateArticleBlocks = z.infer<typeof ContentBlock>[];

// PATCH /article/{id} — title required (minLength 10), additionalProperties: false
export type UpdateArticleBody = {
  title: string;
  contentBlocks?: z.infer<typeof ContentBlock>[];
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "UNPUBLISHED";
};

// Legacy type alias kept for existing imports
export const articleInputSchema = z.object({
    article_content_blocks: z.array(ContentBlock),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;





