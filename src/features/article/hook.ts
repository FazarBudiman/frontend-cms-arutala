import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Article, ArticleDetail } from "./type";
import { createArticle, deleteArticle, fetchArticleById, fetchArticles } from "./api";

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

// export function useUploadArticleCover() {
//   return useMutation({
//     mutationFn: uploadArticleCover,
//   });
// }

// export function useUpdateArticle() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ articleId, body }: { articleId: string; body: { contentBlocks?: ArticleInput["contentBlocks"]; status?: "DRAFT" | "PUBLISHED" } }) => updateArticle(articleId, body),
//     onSuccess: (_data, variables) => {
//       queryClient.invalidateQueries({ queryKey: ["articles"] });
//       queryClient.invalidateQueries({ queryKey: ["article", variables.articleId] });
//     },
//   });
// }

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
