import { clientApi } from "@/shared/lib/http/client-api";
import { Contributor } from "./type";

/* ---------- GET ---------- */
export async function fetchContributors(): Promise<Contributor[]> {
  return await clientApi.get<Contributor[]>("/api/contributors");
}

/* ---------- POST ---------- */
export async function createContributor(formData: FormData) {
  return await clientApi.post("/api/contributors", formData);
}

/* ---------- UPDATE ---------- */
export async function updateContributor(contributorId: string, data: FormData | object) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return await clientApi.patch(`/api/contributors/${contributorId}`, body as BodyInit);
}

/* ---------- DELETE ---------- */
export async function deleteContributor(contributorId: string) {
  return clientApi.delete(`/api/contributors/${contributorId}`);
}
