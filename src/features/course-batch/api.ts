import { clientApi } from "@/shared/lib/http/client-api";
import { CourseBatch, CourseBatchInput } from "./type";

export async function fetchCourseBatch(courseId: string, batchId: string) {
  return clientApi.get<CourseBatch>(`/api/courses/${courseId}/batch/${batchId}`);
}

export async function createCourseBatch(courseId: string, payload: CourseBatchInput) {
  const body = JSON.stringify(payload);
  return clientApi.post<null>(`/api/courses/${courseId}/batch`, body);
}

export async function updateCourseBatch(courseId: string, batchId: string, payload: CourseBatchInput) {
  const body = JSON.stringify(payload);
  return clientApi.patch(`/api/courses/${courseId}/batch/${batchId}`, body);
}

export async function deleteCourseBatch(courseId: string, batchId: string) {
  return await clientApi.delete(`/api/courses/${courseId}/batch/${batchId}`);
}

export async function uploadCourseBatch(courseId: string, batchId: string, formData: FormData) {
  return await clientApi.post<null>(`/api/courses/${courseId}/batch/${batchId}/upload`, formData);
}
