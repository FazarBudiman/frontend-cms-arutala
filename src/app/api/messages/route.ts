// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/types/message";
import { ApiResponse } from "@/types/api";

const API_EXTERNAL = process.env.NEXT_API_EXTERNAL!;

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const res = await fetch(`${API_EXTERNAL}/messages`, {
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
        message: json.message ?? "Failed to fetch messages",
      },
      { status: res.status },
    );
  }

  return NextResponse.json<ApiResponse<Message[]>>({
    success: true,
    message: "Messages fetched",
    data: json.data,
  });
}

export async function DELETE(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const { messageId } = await req.json();

  const res = await fetch(`${API_EXTERNAL}/messages/${messageId}`, {
    method: "DELETE",
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
        message: json.message ?? "Delete failed",
      },
      { status: res.status },
    );
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    message: json.message,
    data: null,
  });
}

export async function PUT(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const { messageId, status } = await req.json();

  const res = await fetch(`${API_EXTERNAL}/messages/${messageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({ status }),
  });

  const json = await res.json();

  if (!res.ok) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        statusCode: String(res.status),
        message: json.message ?? "Update failed",
      },
      { status: res.status },
    );
  }

  return NextResponse.json<ApiResponse<null>>({
    success: true,
    message: json.message,
    data: null,
  });
}
