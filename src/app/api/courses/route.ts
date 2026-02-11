import { Course } from "@/features/course";
import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await serverFetch<Course[]>("/courses");
    return NextResponse.json({
      success: true,
      data: courses,
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
