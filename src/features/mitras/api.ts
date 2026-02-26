import { clientApi } from "@/shared/lib/http/client-api";
import { Mitra } from "./type";

/* ---------- GET ---------- */
export async function fetchMitras(): Promise<Mitra[]> {
  return await clientApi.get<Mitra[]>("/api/mitras");
}

/* ---------- POST ---------- */
export async function createMitra(formData: FormData) {
  return await clientApi.post("/api/mitras", formData);
}

/* ---------- UPDATE ---------- */
export async function updateMitra(mitraId: string, data: FormData | object) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  console.log(body);
  return await clientApi.patch(`/api/mitras/${mitraId}`, body as BodyInit);
}

/* ---------- DELETE ---------- */
export async function deleteMitra(mitraId: string) {
  return await clientApi.delete(`/api/mitras/${mitraId}`);
}
