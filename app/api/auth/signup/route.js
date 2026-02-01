import { NextResponse } from "next/server";
import { signup, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { username, email, password, displayName } = body;

  if (!username || !email || !password || !displayName) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const result = signup({ username, email, password, displayName });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ success: true, userId: result.userId });
  response.cookies.set(SESSION_COOKIE, result.sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE / 1000,
    path: "/",
  });

  return response;
}
