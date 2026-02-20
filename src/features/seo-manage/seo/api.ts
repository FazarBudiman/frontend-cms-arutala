import { clientApi } from "@/shared/lib/http/client-api";
import { Seo, SeoInput } from "./type";

/* ---------- GET ALL ---------- */
export async function fetchSeo(pageId: string): Promise<Seo[]> {
  return await clientApi.get<Seo[]>(`/api/pages/${pageId}/seo`);
}

/* ---------- GET By ID ---------- */
export async function createSeoInPage(pageId: string, payload: SeoInput) {
  const body = JSON.stringify(payload);
  return await clientApi.post<null>(`/api/pages/${pageId}/seo`, body);
}

/* ---------- PUT Change Status ---------- */
export async function changeStatusSeo(pageId: string, seoId: string) {
  return await clientApi.put<null>(`/api/pages/${pageId}/seo/${seoId}`, null);
}
/* ---------- PUT Change Status ---------- */
export async function updateDetailSeo(pageId: string, seoId: string, payload: SeoInput) {
  const body = JSON.stringify(payload);
  return await clientApi.patch<null>(`/api/pages/${pageId}/seo/${seoId}`, body);
}
/* ---------- PUT Change Status ---------- */
export async function deleteSeo(pageId: string, seoId: string) {
  return await clientApi.delete<null>(`/api/pages/${pageId}/seo/${seoId}`);
}
