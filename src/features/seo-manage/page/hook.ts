import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Page } from "./type";
import { deletePage, fetchPageById, fetchPages } from "./api";

export function usePages() {
  return useQuery<Page[]>({
    queryKey: ["pages"],
    queryFn: fetchPages,
  });
}

export function usePage(pageId: string) {
  return useQuery<Page>({
    queryKey: ["pagedetail"],
    queryFn: () => fetchPageById(pageId),
  });
}
export function useDeletePages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}
