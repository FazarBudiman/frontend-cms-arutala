import { ApiResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

const { NEXT_API_EXTERNAL } = process.env;

export type SignInResponse = {
  access_token: string;
  refresh_token: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${NEXT_API_EXTERNAL!}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // const resJson = (await res.json()) as ApiResponse<SignInResponse>;
  const resJson = await res.json();

  if (resJson.success === false) {
    return NextResponse.json(resJson, { status: res.status });
  }

  const response = NextResponse.json(resJson);
  response.cookies.set("accessToken", resJson.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });

  response.cookies.set("refreshToken", resJson.data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

export async function DELETE(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const res = await fetch(`${NEXT_API_EXTERNAL}/auth/sign-out`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const resJson = (await res.json()) as ApiResponse<null>;
  if (resJson.success === false) {
    return NextResponse.json(resJson, { status: res.status });
  }

  const response = NextResponse.json(resJson);

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
  }

  const res = await fetch(`${NEXT_API_EXTERNAL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const resJson = await res.json();

  return NextResponse.json(resJson, { status: res.status });
}
