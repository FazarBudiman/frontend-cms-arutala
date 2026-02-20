import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ articleId: string }> };

/**
 * POST /api/article/[articleId]/cover
 * Adds a cover to an article that has no cover yet.
 * Expects multipart/form-data: cover_image (file) + cover_description (string, minLength: 20)
 */
export async function POST(req: NextRequest, context: Params) {
  try {
    const { articleId } = await context.params;
    const formData = await req.formData();
    await serverFetch(`/article/${articleId}/cover`, {
      method: "POST",
      body: formData,
    });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/article/[articleId]/cover
 * Updates an existing cover.
 * Expects multipart/form-data: cover_image (file, optional) + cover_description (string, minLength: 20, optional)
 */
export async function PATCH(req: NextRequest, context: Params) {
  try {
    const { articleId } = await context.params;
    const formData = await req.formData();
    await serverFetch(`/article/${articleId}/cover`, {
      method: "PATCH",
      body: formData,
    });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
