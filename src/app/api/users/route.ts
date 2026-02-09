import { ResponseError, ResponseSuccess } from "@/lib/http/response";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

const API_EXTERNAL = process.env.NEXT_API_EXTERNAL!;

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const res = await fetch(`${API_EXTERNAL}/users`, {
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  const json = await res.json();

  if (!res.ok) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        statusCode: String(res.status),
        message: json.message ?? "Failed to fetch users",
      },
      { status: res.status },
    );
  }

  return NextResponse.json<ApiResponse<User[]>>({
    success: true,
    message: "User Fetched",
    data: json.data,
  });
}

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const requestBody = await req.formData();

  const res = await fetch(`${API_EXTERNAL}/users`, {
    method: "POST",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: requestBody,
  });

  const json = await res.json();

  console.log(json);

  if (!res.ok) {
    return ResponseError(json.message ?? "Create User Failed", json.status);
  }

  return ResponseSuccess(null, json.message);
}

export async function DELETE(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const { userId } = await req.json();

  const res = await fetch(`${API_EXTERNAL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  const json = await res.json();

  console.log(json);

  if (!res.ok) {
    return ResponseError(json.message ?? "Delete Failed", json.status);
  }

  return ResponseSuccess(null, json.message);
}
