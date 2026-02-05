import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const protectedRoutes = ["/general", "/profile", "/admin"];
const publicRoutes = ["/login", "/register", "/"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const token = request.cookies.get("accessToken")?.value;

  // Verify token dengan API
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && token && path === "/sign-in") {
    return NextResponse.redirect(new URL("/general", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
