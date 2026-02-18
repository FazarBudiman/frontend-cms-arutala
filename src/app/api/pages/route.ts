import { Page } from "@/features/seo-manage";
import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pages = await serverFetch<Page[]>("/pages");
    // console.log(pages);
    return NextResponse.json({
      success: true,
      data: pages,
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

// export async function POST(req: NextRequest) {
//   try {
//   } catch (error) {}
// }
