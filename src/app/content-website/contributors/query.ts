import { ApiResponse } from "@/types/api";
import { Contributor } from "@/types/contributor";

export async function fetchContributors(): Promise<Contributor[]> {
  const res = await fetch("/api/contributors", {
    credentials: "include",
    cache: "no-store",
  });

  const json: ApiResponse<Contributor[]> = await res.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data ?? [];
}
