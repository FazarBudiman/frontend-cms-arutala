import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, context: { params: Promise<{ pageId: string; seoId: string }> }) {
  try {
    const { pageId, seoId } = await context.params;
    await serverFetch(`/pages/${pageId}/seo/${seoId}`, {
      method: "PUT",
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

export async function PATCH(req: NextRequest, context: { params: Promise<{ pageId: string; seoId: string }> }) {
  try {
    const { pageId, seoId } = await context.params;
    const body = await req.json();
    await serverFetch(`/pages/${pageId}/seo/${seoId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
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

export async function DELETE(req: NextRequest, context: { params: Promise<{ pageId: string; seoId: string }> }) {
  try {
    const { pageId, seoId } = await context.params;
    await serverFetch(`/pages/${pageId}/seo/${seoId}`, {
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
