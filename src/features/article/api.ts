import { clientApi } from "@/shared/lib/http/client-api";
import { Article, ArticleDetail, ArticleInput } from "./type";

export async function fetchArticles(): Promise<Article[]> {
  return clientApi.get<Article[]>("/api/article");
}

export async function fetchArticleById(articleId: string): Promise<ArticleDetail> {
  return clientApi.get<ArticleDetail>(`/api/article/${articleId}`);
}

export async function createArticle(payload: ArticleInput) {
  return clientApi.post<null>("/api/article", JSON.stringify(payload));
}

export async function uploadArticleCover(formData: FormData): Promise<{ url: string }> {
  return clientApi.post<{ url: string }>("/api/article/upload", formData);
}

export async function updateArticle(
  articleId: string,
  payload: { contentBlocks?: ArticleInput["article_content_blocks"]; status?: "DRAFT" | "PUBLISHED" },
) {
  return clientApi.patch(`/api/article/${articleId}`, JSON.stringify(payload));
}

export async function deleteArticle(articleId: string) {
  return clientApi.delete(`/api/article/${articleId}`);
}