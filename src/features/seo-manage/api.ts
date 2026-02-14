import { clientApi } from "@/shared/lib/http/client-api";
import { Page } from "./type";

/* ---------- GET ---------- */
export async function fetchPages(): Promise<Page[]> {
  return await clientApi.get<Page[]>("/api/pages");
}

/* ---------- DELETE ---------- */
export async function deletePage(pageId: string) {
  return await clientApi.delete(`/api/pages/${pageId}`);
}
