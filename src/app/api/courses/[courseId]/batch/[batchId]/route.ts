import { CourseBatch } from "@/features/course-batch/type";
import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ courseId: string; batchId: string }> }) {
  try {
    const { courseId, batchId } = await context.params;
    const courseBatch = await serverFetch<CourseBatch>(`/courses/${courseId}/batch/${batchId}`, {
      method: "GET",
    });
    // console.log("course-batch", courseBatch);
    const response = NextResponse.json({
      success: true,
      data: courseBatch,
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

export async function PATCH(req: NextRequest, context: { params: Promise<{ courseId: string; batchId: string }> }) {
  try {
    const { courseId, batchId } = await context.params;
    const body = await req.json();
    console.log(body);

    await serverFetch(`/courses/${courseId}/batch/${batchId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
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

export async function DELETE(req: NextRequest, context: { params: Promise<{ courseId: string; batchId: string }> }) {
  try {
    const { courseId, batchId } = await context.params;
    await serverFetch<null>(`/courses/${courseId}/batch/${batchId}`, {
      method: "DELETE",
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
