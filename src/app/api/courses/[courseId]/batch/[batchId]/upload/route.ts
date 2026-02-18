import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ courseId: string; batchId: string }> }) {
  try {
    const { courseId, batchId } = await context.params;
    const formData = await req.formData();
    await serverFetch<null>(`/courses/${courseId}/batch/${batchId}/upload`, {
      method: "POST",
      body: formData,
    });
    const response = NextResponse.json({
      success: true,
      data: null,
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
