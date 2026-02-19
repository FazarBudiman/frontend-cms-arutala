import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Course, CourseBenefit, CourseCategory, CourseDetail, CourseField, CourseInput } from "./type";
import { createCourse, deleteCourse, fetchCourseBenefit, fetchCourseById, fetchCourseCategory, fetchCourseField, fetchCourses, updateCourse } from "./api";

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
