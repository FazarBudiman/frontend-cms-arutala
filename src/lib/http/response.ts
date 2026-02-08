import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";

export function ResponseSuccess<T>(data: T, message = "OK", status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

export function ResponseError(message: string, status = 500) {
  return NextResponse.json(
    {
      success: false,
      statusCode: `${status}`,
      message,
    },
    { status },
  );
}
