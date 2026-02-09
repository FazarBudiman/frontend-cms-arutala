import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

/* ---------- GET ---------- */
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users", {
    credentials: "include",
    cache: "no-store",
  });
  const json: ApiResponse<User[]> = await res.json();
  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data ?? [];
}

/* ---------- POST ---------- */
export async function createUser(formData: FormData) {
  const res = await fetch("/api/users", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  console.log(res);
  return res.json();
}

/* ---------- DELETE ---------- */
export async function deleteUser(userId: string): Promise<ApiResponse<null>> {
  const res = await fetch("/api/users", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "aplication/json" },
    body: JSON.stringify({ userId }),
  });

  return res.json();
}
