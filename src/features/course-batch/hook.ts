import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseBatch, CourseBatchInput } from "./type";
import { createCourseBatch, deleteCourseBatch, fetchCourseBatch, updateCourseBatch, uploadCourseBatch } from "./api";

export function useCourseBatch(courseId: string, batchId: string, options?: { enabled?: boolean }) {
  return useQuery<CourseBatch>({
    queryKey: ["coursesbatch", batchId],
    queryFn: () => fetchCourseBatch(courseId, batchId),
    enabled: options?.enabled ?? !!batchId,
  });
}

export function useCreateCourseBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, body }: { courseId: string; body: CourseBatchInput }) => createCourseBatch(courseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coursesdetail"] });
    },
  });
}

export function useUpdateCourseBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, batchId, body }: { courseId: string; batchId: string; body: CourseBatchInput }) => updateCourseBatch(courseId, batchId, body),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["coursesbatch", variables.batchId],
      });

      queryClient.invalidateQueries({
        queryKey: ["coursesdetail", variables.courseId],
      });
    },
  });
}

export function useDeleteCourseBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, batchId }: { courseId: string; batchId: string }) => deleteCourseBatch(courseId, batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coursesdetail"] });
    },
  });
}

export function useUploadCourseBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, batchId, formData }: { courseId: string; batchId: string; formData: FormData }) => uploadCourseBatch(courseId, batchId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coursesdetail"] });
    },
  });
}
