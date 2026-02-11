import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Contributor } from "./type";
import { createContributor, deleteContributor, fetchContributors, updateContributor } from "./api";

export function useContributors() {
  return useQuery<Contributor[]>({
    queryKey: ["contributors"],
    queryFn: fetchContributors,
  });
}

export function useCreateContributor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContributor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
    },
  });
}

export function useUpdateContributor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateContributor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contributors"],
      });
    },
  });
}

export function useDeleteContributor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContributor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
    },
  });
}
