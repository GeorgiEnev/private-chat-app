import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/", "/login", "/signup"];
const protectedRoutes = ["/dashboard"];

export function proxy(request: NextRequest) {
  const sessionCookie =
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token");

  const isAuthenticated = !!sessionCookie;
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};
