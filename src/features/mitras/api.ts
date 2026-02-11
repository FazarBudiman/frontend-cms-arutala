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
export async function updateMitra(mitraId: string, formData: FormData) {
  return await clientApi.patch(`/api/mitras/${mitraId}`, formData);
}

/* ---------- DELETE ---------- */
export async function deleteMitra(mitraId: string) {
  return await clientApi.delete(`/api/mitras/${mitraId}`);
}
