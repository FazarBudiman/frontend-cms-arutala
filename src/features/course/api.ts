import { clientApi } from "@/shared/lib/http/client-api";
import { Course, CourseBenefit, CourseCategory, CourseDetail, CourseField, CourseInput } from "./type";

export async function fetchCourses(): Promise<Course[]> {
  return clientApi.get<Course[]>("/api/courses");
}

export async function fetchCourseById(courseId: string) {
  return clientApi.get<CourseDetail>(`/api/courses/${courseId}`);
}

export async function fetchCourseCategory(): Promise<CourseCategory[]> {
  return clientApi.get<CourseCategory[]>("/api/courses/courses-category");
}

export async function fetchCourseField(): Promise<CourseField[]> {
  return clientApi.get<CourseField[]>("/api/courses/courses-field");
}

export async function fetchCourseBenefit(): Promise<CourseBenefit[]> {
  return clientApi.get<CourseBenefit[]>("/api/courses/courses-benefit");
}

export async function createCourse(payload: CourseInput) {
  const body = JSON.stringify(payload);
  return clientApi.post<null>("/api/courses", body);
}

export async function updateCourse(courseId: string, payload: CourseInput) {
  // const body = JSON.stringify(payload);
  return clientApi.patch(`/api/courses/${courseId}`, JSON.stringify(payload));
}

export async function deleteCourse(courseId: string) {
  return await clientApi.delete(`/api/courses/${courseId}`);
}
