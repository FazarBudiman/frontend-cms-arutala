import { ApiResponse } from "@/shared/types/api-response";

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    ...init,
  });
  console.log(res);

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    // console.log(json);
    throw new Error(json.message);
  }

  console.log(await json.data);

  return json.data as T;
}

export const clientApi = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: BodyInit) =>
    request<T>(url, {
      method: "POST",
      body,
    }),

  patch: <T>(url: string, body: BodyInit) =>
    request<T>(url, {
      method: "PATCH",
      body,
    }),

  put: <T>(url: string, body: BodyInit | null) =>
    request<T>(url, {
      method: "PUT",
      body,
    }),

  delete: <T>(url: string, body?: BodyInit) =>
    request<T>(url, {
      method: "DELETE",
      body,
    }),
};
