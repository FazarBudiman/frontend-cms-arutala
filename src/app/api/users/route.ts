import { User } from "@/features/user";
import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await serverFetch<User[]>("/users");
    return NextResponse.json({
      success: true,
      data: users,
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

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.formData();
    const response = await serverFetch("/users", {
      method: "POST",
      body: requestBody,
    });

    return NextResponse.json({
      success: true,
      data: response,
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

// export async function DELETE(req: NextRequest) {
//   try {
//     const { userId } = await req.json();
//     await serverFetch(`/users/${userId}`, { method: "DELETE" });
//   } catch (error) {
//     if (error instanceof ApiError) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: error.message,
//         },
//         { status: error.status },
//       );
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal Server Error",
//       },
//       { status: 500 },
//     );
//   }
// }
