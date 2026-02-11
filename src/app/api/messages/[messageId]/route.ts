import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: { params: Promise<{ messageId: string }> }) {
  try {
    const { messageId } = await context.params;
    await serverFetch(`/messages/${messageId}`, {
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

export async function PUT(req: NextRequest, context: { params: Promise<{ messageId: string }> }) {
  try {
    const { messageId } = await context.params;
    const { status } = await req.json();
    await serverFetch(`/messages/${messageId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
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
