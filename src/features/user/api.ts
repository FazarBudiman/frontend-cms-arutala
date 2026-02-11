import { clientApi } from "@/shared/lib/http/client-api";
import { User } from "@/features/user/type";

/* ---------- GET ---------- */
export async function fetchUsers(): Promise<User[]> {
  return await clientApi.get<User[]>("/api/users");
}

/* ---------- POST ---------- */
export async function createUser(formData: FormData) {
  return clientApi.post("/api/users", formData);
}

/* ---------- DELETE ---------- */
export async function deleteUser(userId: string) {
  return clientApi.delete(`/api/users/${userId}`);
}
