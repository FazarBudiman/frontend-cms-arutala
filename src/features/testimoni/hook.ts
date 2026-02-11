import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Testimoni } from "./type";
import { createTestimoni, deleteTestimoni, fetchTestimonies, updateTestimoni } from "./api";

export function useTestimonies() {
  return useQuery<Testimoni[]>({
    queryKey: ["testimonies"],
    queryFn: fetchTestimonies,
  });
}

export function useCreateTestimoni() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimoni,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
  });
}

export function useUpdateTestimoni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateTestimoni(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["testimonies"],
      });
    },
  });
}

export function useDeleteTestimoni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTestimoni,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
  });
}
