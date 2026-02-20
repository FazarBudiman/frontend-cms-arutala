import { Article } from "@/features/article";
import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const articles = await serverFetch<Article[]>("/article");
    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const article = await serverFetch<Article>("/article/", {
      method: "POST",
      body: JSON.stringify({
        contentBlocks: body.contentBlocks,
      }),
    });
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
