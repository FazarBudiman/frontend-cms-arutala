import { ApiResponse } from "@/types/api";
import { SignInResponse } from "../api/auth/route";

export type AuthState = {
  success?: boolean;
  message?: string;
};

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return { success: false, message: "Username dan password wajib diisi" };
  }

  const res = await fetch(`/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return (await res.json()) as ApiResponse<SignInResponse>;
}

export async function logoutAction(): Promise<AuthState> {
  const res = await fetch(`/api/auth`, { method: "DELETE" });
  return res.json();
}
