import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Article, ArticleDetail, ArticleStatusType, ContentBlockType } from "./type";
import { createArticle, createArticleCover, deleteArticle, fetchArticleById, fetchArticles, updateArticle, updateArticleCover } from "./api";

// Article
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
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articleId, body }: { articleId: string; body: { status?: ArticleStatusType; contentBlocks?: ContentBlockType[] } }) => updateArticle(articleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
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

// Article Cover
export function useCreateArticleCover(articleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createArticleCover(articleId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}


export function useUpdateArticleCover(articleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => updateArticleCover(articleId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
