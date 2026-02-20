import { clientApi } from "@/shared/lib/http/client-api";
import { Page } from "./type";

/* ---------- GET ALL ---------- */
export async function fetchPages(): Promise<Page[]> {
  return await clientApi.get<Page[]>("/api/pages");
}

/* ---------- GET By ID ---------- */
export async function fetchPageById(pageId: string): Promise<Page> {
  return await clientApi.get(`/api/pages/${pageId}`);
}

/* ---------- DELETE ---------- */
export async function deletePage(pageId: string) {
  return await clientApi.delete(`/api/pages/${pageId}`);
}
