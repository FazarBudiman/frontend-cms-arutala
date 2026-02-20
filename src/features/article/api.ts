import { clientApi } from "@/shared/lib/http/client-api";
import { Article, ArticleDetail, UpdateArticleBody } from "./type";

export async function fetchArticles(): Promise<Article[]> {
  return clientApi.get<Article[]>("/api/article");
}

export async function fetchArticleById(articleId: string): Promise<ArticleDetail> {
  return clientApi.get<ArticleDetail>(`/api/article/${articleId}`);
}

/**
 * POST /article/
 * Backend only accepts contentBlocks (minItems: 1).
 * title + cover are handled separately after creation.
 */
export async function createArticle(title?: string): Promise<Article> {
  // Backend requires minItems: 1 AND at least 1 header block
  return clientApi.post<Article>("/api/article", JSON.stringify({
    contentBlocks: [{ id: "init-block", type: "header", data: { text: title ?? "Judul Artikel", level: 1 } }],
  }));
}

/**
 * PATCH /article/{id}
 * title is REQUIRED (minLength: 10).
 * additionalProperties: false — only title, contentBlocks, status accepted.
 */
export async function updateArticle(
  articleId: string,
  payload: UpdateArticleBody,
) {
  return clientApi.patch(`/api/article/${articleId}`, JSON.stringify({
    title: payload.title,
    ...(payload.contentBlocks !== undefined ? { contentBlocks: payload.contentBlocks } : {}),
    ...(payload.status ? { status: payload.status } : {}),
  }));
}

/**
 * POST /article/{id}/cover — add cover (multipart/form-data)
 * cover_image (file, required) + cover_description (string, minLength: 20, required)
 */
export async function uploadArticleCover(articleId: string, formData: FormData): Promise<void> {
  return clientApi.post(`/api/article/${articleId}/cover`, formData);
}

/**
 * PATCH /article/{id}/cover — update existing cover (multipart/form-data)
 * cover_image (file, optional) + cover_description (string, minLength: 20, optional)
 */
export async function patchArticleCover(articleId: string, formData: FormData): Promise<void> {
  return clientApi.patch(`/api/article/${articleId}/cover`, formData);
}

export async function deleteArticle(articleId: string) {
  return clientApi.delete(`/api/article/${articleId}`);
}