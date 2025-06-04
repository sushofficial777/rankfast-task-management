import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/api/auth"]; // pages that don't need auth

export async function middleware(req: NextRequest) {
  // Get token (session) from NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // 1. If user is logged in and tries to access login or signup, redirect to "/"
  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. If user is NOT logged in and tries to access a protected route (not public path)
  if (!token && !PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    // redirect to login page
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 3. Otherwise continue
  return NextResponse.next();
}

// Configure matcher - paths for which middleware runs
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
