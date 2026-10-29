import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const token = request.headers.get("cookie")?.includes("school_session=");
  const protectedPaths = ["/dashboard", "/courses", "/results", "/admin", "/teachers"];

  const path = new URL(request.url).pathname;
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/results/:path*", "/admin/:path*", "/teachers/:path*"]
};
