import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Page } from "./type";
import { deletePage, fetchPages } from "./api";

export function usePages() {
  return useQuery<Page[]>({
    queryKey: ["pages"],
    queryFn: fetchPages,
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
