import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "./lib/decode-jwt";

const ADMIN_FORBIDDEN_PATHS = ["/general/users"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/general/dashboard", req.url));
  }

  if (token) {
    const payload = decodeJwt(token);
    const role = payload?.user_role;
    if (role === "ADMIN" && ADMIN_FORBIDDEN_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/general/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/general/:path*", "/content-website/:path*", "/sign-in"],
};
