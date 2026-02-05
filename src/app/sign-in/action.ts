"use server";

import { cookies } from "next/headers";
import { login, logout } from "@/lib/api/auth.api";
import { redirect } from "next/navigation";

export type AuthState = {
  error?: string;
};

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi" };
  }

  const response = await login(username, password);

  if (!response.success || !response.data) {
    return { error: response.message ?? "Login gagal" };
  }

  const cookieStore = await cookies();
  cookieStore.set("accessToken", response.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });

  cookieStore.set("refreshToken", response.data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });

  return {};
}

export async function logoutAction() {
  const cookieStore = await cookies();

  try {
    const token = cookieStore.get("refreshToken")?.value;
    const response = await logout(token);
    if (!response.success) {
      console.warn("Logout API Erorr", response.message);
    }
  } catch (error) {
    console.error("Logout Network Error", error);
  } finally {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    redirect("/sign-in");
  }
}
