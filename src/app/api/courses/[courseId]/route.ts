import { CourseDetail } from "@/features/course";
import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params;
    const course = await serverFetch<CourseDetail>(`/courses/${courseId}`);
    return NextResponse.json({
      success: true,
      data: course,
    });
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

export async function PATCH(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params;
    const contentType = req.headers.get("content-type") || "";
    let body;

    if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
    } else {
      body = JSON.stringify(await req.json());
    }

    await serverFetch(`/courses/${courseId}`, {
      method: "PATCH",
      body: body,
    });
    return NextResponse.json({
      success: true,
      data: null,
    });
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

export async function DELETE(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params;
    await serverFetch(`/courses/${courseId}`, {
      method: "DELETE",
    });
    return NextResponse.json({
      success: true,
      data: null,
    });
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
