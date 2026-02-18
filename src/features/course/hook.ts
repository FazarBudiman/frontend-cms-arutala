import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Course, CourseBatch, CourseBatchInput, CourseBenefit, CourseCategory, CourseDetail, CourseField, CourseInput } from "./type";
import {
  createCourse,
  createCourseBatch,
  deleteCourse,
  deleteCourseBatch,
  fetchCourseBatch,
  fetchCourseBenefit,
  fetchCourseById,
  fetchCourseCategory,
  fetchCourseField,
  fetchCourses,
  updateCourse,
  updateCourseBatch,
  uploadCourseBatch,
} from "./api";

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
}

export function useCourseDetail(courseId: string, options?: { enabled?: boolean }) {
  return useQuery<CourseDetail>({
    queryKey: ["coursesdetail", courseId],
    queryFn: () => fetchCourseById(courseId),
    enabled: options?.enabled ?? !!courseId,
  });
}

export function useCourseCategory() {
  return useQuery<CourseCategory[]>({
    queryKey: ["coursescategory"],
    queryFn: fetchCourseCategory,
  });
}

export function useCourseField() {
  return useQuery<CourseField[]>({
    queryKey: ["coursesfield"],
    queryFn: fetchCourseField,
  });
}
export function useCourseBenefit() {
  return useQuery<CourseBenefit[]>({
    queryKey: ["coursesbenefits"],
    queryFn: fetchCourseBenefit,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, body }: { courseId: string; body: CourseInput }) => updateCourse(courseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coursesdetail"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

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
    // onSuccess: (data, variables) => {
    //   queryClient.setQueryData(["coursesbatch", variables.batchId], data);
    // },
    onSuccess: (_, variables) => {
      // refresh detail batch yang sedang dibuka
      queryClient.invalidateQueries({
        queryKey: ["coursesbatch", variables.batchId],
      });

      // optional: refresh course detail juga
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
