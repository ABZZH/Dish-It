import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const user = getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const existing = db
      .prepare("SELECT id FROM likes WHERE user_id = ? AND recipe_id = ?")
      .get(user.userId, params.id);

    if (existing) {
      db.prepare("DELETE FROM likes WHERE user_id = ? AND recipe_id = ?").run(user.userId, params.id);
      return NextResponse.json({ liked: false });
    } else {
      db.prepare("INSERT INTO likes (user_id, recipe_id) VALUES (?, ?)").run(user.userId, params.id);
      return NextResponse.json({ liked: true });
    }
  } catch (err) {
    console.error("POST /api/recipes/[id]/like error:", err);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const user = getSession();
    if (!user) {
      return NextResponse.json({ liked: false });
    }

    const db = getDb();
    const existing = db
      .prepare("SELECT id FROM likes WHERE user_id = ? AND recipe_id = ?")
      .get(user.userId, params.id);

    return NextResponse.json({ liked: !!existing });
  } catch (err) {
    console.error("GET /api/recipes/[id]/like error:", err);
    return NextResponse.json({ liked: false });
  }
}
