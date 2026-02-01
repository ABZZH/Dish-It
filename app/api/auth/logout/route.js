import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, deleteSession } from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (sessionCookie) {
    deleteSession(sessionCookie.value);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
