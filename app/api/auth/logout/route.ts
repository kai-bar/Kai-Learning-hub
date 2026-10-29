import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  response.cookies.set("school_session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0)
  });

  return response;
}
