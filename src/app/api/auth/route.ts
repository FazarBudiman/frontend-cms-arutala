import { User } from "@/features/user/type";
import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextRequest, NextResponse } from "next/server";

export type SignInResponse = {
  access_token: string;
  refresh_token: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await serverFetch<SignInResponse>("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const response = NextResponse.json({
      success: true,
      message: "Login Successfully",
    });

    response.cookies.set("accessToken", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
    response.cookies.set("refreshToken", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
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

export async function DELETE(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No Refresh Token",
        },
        { status: 400 },
      );
    }
    await serverFetch<null>("/auth/sign-out", {
      method: "DELETE",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const response = NextResponse.json({
      success: true,
      message: "Logout Berhasil",
    });

    response.cookies.set("accessToken", "", {
      expires: new Date(0),
      path: "/",
    });
    response.cookies.set("refreshToken", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
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

export async function GET() {
  try {
    const user = await serverFetch<User>("/auth/me");

    return NextResponse.json({
      success: true,
      data: user,
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
