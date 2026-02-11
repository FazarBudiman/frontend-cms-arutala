import { clientApi } from "@/shared/lib/http/client-api";
import { Course } from "./type";

export async function fetchCourses(): Promise<Course[]> {
  return clientApi.get<Course[]>("/api/courses");
}
