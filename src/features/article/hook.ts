import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Article, ArticleDetail, UpdateArticleBody } from "./type";
import {
  createArticle,
  deleteArticle,
  fetchArticleById,
  fetchArticles,
  updateArticle,
  uploadArticleCover,
  patchArticleCover,
} from "./api";

export function useArticles() {
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });
}

export function useArticleDetail(articleId: string, options?: { enabled?: boolean }) {
  return useQuery<ArticleDetail>({
    queryKey: ["article", articleId],
    queryFn: () => fetchArticleById(articleId),
    enabled: options?.enabled ?? !!articleId,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title?: string) => createArticle(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      body,
    }: {
      articleId: string;
      body: UpdateArticleBody;
    }) => updateArticle(articleId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", variables.articleId] });
    },
  });
}

/** POST /article/{id}/cover — adds cover to article that has no cover yet */
export function useUploadArticleCover() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articleId, formData }: { articleId: string; formData: FormData }) =>
      uploadArticleCover(articleId, formData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["article", variables.articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

/** PATCH /article/{id}/cover — updates existing cover */
export function usePatchArticleCover() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articleId, formData }: { articleId: string; formData: FormData }) =>
      patchArticleCover(articleId, formData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["article", variables.articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}