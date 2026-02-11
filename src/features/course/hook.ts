import { useQuery } from "@tanstack/react-query";
import { Course } from "./type";
import { fetchCourses } from "./api";

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
}
