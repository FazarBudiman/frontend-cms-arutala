import { ApiResponse } from "@/types/api";
import { SignInResponse } from "../api/auth/route";
import { User } from "@/types/user";

export type AuthState = {
  success?: boolean;
  message?: string;
};

// export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
//   const username = formData.get("username");
//   const password = formData.get("password");

//   if (!username || !password) {
//     return { success: false, message: "Username dan password wajib diisi" };
//   }

//   const res = await fetch(`/api/auth`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });

//   return (await res.json()) as ApiResponse<SignInResponse>;
// }
export async function loginAction(payload: { username: string; password: string }) {
  const { username, password } = payload;
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

export async function fetchUserAuthenticated(): Promise<User> {
  const res = await fetch("/api/auth", {
    method: "GET",
    credentials: "include",
  });

  const json = (await res.json()) as ApiResponse<User>;

  if (!json.success || json.data === undefined) {
    throw new Error(json.message);
  }

  return json.data;
}
