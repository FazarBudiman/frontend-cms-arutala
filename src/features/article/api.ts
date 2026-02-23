import { clientApi } from "@/shared/lib/http/client-api";
import { Article, ArticleDetail, ArticleInput, ArticleStatusType, ContentBlockType } from "./type";

// Article
export async function fetchArticles(): Promise<Article[]> {
  return clientApi.get<Article[]>("/api/article");
}

export async function fetchArticleById(articleId: string): Promise<ArticleDetail> {
  return clientApi.get<ArticleDetail>(`/api/article/${articleId}`);
}

export async function createArticle(payload: ArticleInput): Promise<ArticleDetail> {
  return clientApi.post<ArticleDetail>("/api/article", JSON.stringify(payload));
}

export async function updateArticle(articleId: string, payload: { status?: ArticleStatusType, contentBlocks?: ContentBlockType[] }) {
  return clientApi.patch(`/api/article/${articleId}`, JSON.stringify(payload));
}

export async function deleteArticle(articleId: string) {
  return clientApi.delete(`/api/article/${articleId}`);
}

export async function uploadArticleImage(formData: FormData): Promise<string> {
  return clientApi.post<string>("/api/article/upload", formData);
}



// Article Cover
export async function createArticleCover(articleId: string, formData: FormData) {
  return clientApi.post(`/api/article/${articleId}/cover`, formData);
}

export async function updateArticleCover(articleId: string, formData: FormData) {
  return clientApi.patch(`/api/article/${articleId}/cover`, formData);
}

