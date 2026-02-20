import { Seo } from "@/features/seo-manage/seo/type";
import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest, context: { params: Promise<{ pageId: string }> }) {
  try {
    const { pageId } = await context.params;
    const body = await req.json();
    await serverFetch<null>(`/pages/${pageId}/seo`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const response = NextResponse.json({
      success: true,
      data: null,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.cause,
        },
        { status: 400 },
      );
    }

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

export async function GET(req: NextRequest, context: { params: Promise<{ pageId: string }> }) {
  try {
    const { pageId } = await context.params;
    const seo = await serverFetch<Seo>(`/pages/${pageId}/seo`);
    // console.log(seo);
    return NextResponse.json({
      success: true,
      data: seo,
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
