import { SignInResponse } from "@/app/api/auth/route";
import { clientApi } from "@/shared/lib/http/client-api";
import { User } from "@/features/user";

/* ---------- POST ---------- */
export async function loginAction(payload: { username: string; password: string }) {
  return clientApi.post<SignInResponse>("/api/auth", JSON.stringify(payload));
}

/* ---------- DELETE ---------- */
export async function logoutAction() {
  return clientApi.delete<null>("/api/auth");
}

/* ---------- GET ---------- */
export async function fetchUserAuthenticated(): Promise<User> {
  return clientApi.get<User>("/api/auth");
}
