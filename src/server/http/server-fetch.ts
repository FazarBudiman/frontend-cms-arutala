import { cookies } from "next/headers";
import { ApiError } from "../errors/api-error";
import { ApiResponse } from "@/shared/types/api-response";

const API_EXTERNAL = process.env.NEXT_API_EXTERNAL!;

export async function serverFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_EXTERNAL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...options.headers,
    },
    cache: "no-store",
  });

  let json: ApiResponse<T>;

  try {
    json = await res.json();
  } catch {
    throw new ApiError("Invalid JSON response", res.status);
  }

  // console.log(json);

  if (!json.success) {
    throw new ApiError(json.message, res.status, json);
  }

  return json.data;
}
