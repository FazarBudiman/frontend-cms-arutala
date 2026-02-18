import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const result = await serverFetch<{ url: string }>("/article/upload", {
      method: "POST",
      body: formData,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
