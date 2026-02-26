import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mitra } from "./type";
import { createMitra, deleteMitra, fetchMitras, updateMitra } from "./api";

export function useMitras() {
  return useQuery<Mitra[]>({
    queryKey: ["Mitras"],
    queryFn: fetchMitras,
  });
}

export function useCreateMitra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMitra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Mitras"] });
    },
  });
}

export function useUpdateMitra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | object }) => updateMitra(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Mitras"],
      });
    },
  });
}

export function useDeleteMitra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMitra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Mitras"] });
    },
  });
}
