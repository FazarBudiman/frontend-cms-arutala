// lib/auth.ts

import { ApiResponse } from "@/types/api";
const { NEXT_PUBLIC_API_URL } = process.env;

type LoginResponseData = {
  access_token: string;
  refresh_token: string;
};

export async function login(username: string, password: string): Promise<ApiResponse<LoginResponseData>> {
  const res = await fetch(`${NEXT_PUBLIC_API_URL!}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return res.json();
}

export async function logout(refresh_token: string | undefined): Promise<ApiResponse<null>> {
  const res = await fetch(`${NEXT_PUBLIC_API_URL!}/auth/sign-out`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  return res.json();
}
