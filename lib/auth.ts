import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

export function signToken(user: SessionUser) {
  return jwt.sign(user, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "7d"
  });
}

export function getAuthToken() {
  const cookieStore = cookies();
  return cookieStore.get("school_session")?.value ?? null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as SessionUser;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set("school_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete("school_session");
}
