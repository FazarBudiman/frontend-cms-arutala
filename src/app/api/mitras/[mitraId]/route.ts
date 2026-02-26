import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ mitraId: string }> }) {
  try {
    const { mitraId } = await context.params;
    const contentType = req.headers.get("content-type") || "";
    let body;

    if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
    } else {
      body = JSON.stringify(await req.json());
    }

    await serverFetch(`/mitras/${mitraId}`, {
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

export async function DELETE(req: NextRequest, context: { params: Promise<{ mitraId: string }> }) {
  try {
    const { mitraId } = await context.params;
    await serverFetch(`/mitras/${mitraId}`, {
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
