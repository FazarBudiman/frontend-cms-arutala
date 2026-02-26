import { clientApi } from "@/shared/lib/http/client-api";
import { Testimoni } from "./type";

/* ---------- GET ---------- */
export async function fetchTestimonies(): Promise<Testimoni[]> {
  return await clientApi.get<Testimoni[]>("/api/testimonies");
}

/* ---------- POST ---------- */
export async function createTestimoni(formData: FormData) {
  return await clientApi.post("/api/testimonies", formData);
}

/* ---------- UPDATE ---------- */
export async function updateTestimoni(testimoniId: string, data: FormData | object) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return await clientApi.patch(`/api/testimonies/${testimoniId}`, body as BodyInit);
}

/* ---------- DELETE ---------- */
export async function deleteTestimoni(testimoniId: string) {
  return await clientApi.delete(`/api/testimonies/${testimoniId}`);
}
