import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const user = getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("GET /api/auth/me error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request) {
  try {
    const user = getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { display_name, bio } = body;

    if (!display_name) {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    }

    const db = getDb();
    db.prepare("UPDATE users SET display_name = ?, bio = ? WHERE id = ?").run(
      display_name,
      bio || "",
      user.userId
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/auth/me error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
