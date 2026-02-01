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
    const targetUser = db.prepare("SELECT id FROM users WHERE username = ?").get(params.username);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.id === user.userId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const existing = db
      .prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?")
      .get(user.userId, targetUser.id);

    if (existing) {
      db.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").run(
        user.userId,
        targetUser.id
      );
      return NextResponse.json({ following: false });
    } else {
      db.prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)").run(
        user.userId,
        targetUser.id
      );
      return NextResponse.json({ following: true });
    }
  } catch (err) {
    console.error("POST /api/users/[username]/follow error:", err);
    return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const user = getSession();
    if (!user) {
      return NextResponse.json({ following: false });
    }

    const db = getDb();
    const targetUser = db.prepare("SELECT id FROM users WHERE username = ?").get(params.username);

    if (!targetUser) {
      return NextResponse.json({ following: false });
    }

    const existing = db
      .prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?")
      .get(user.userId, targetUser.id);

    return NextResponse.json({ following: !!existing });
  } catch (err) {
    console.error("GET /api/users/[username]/follow error:", err);
    return NextResponse.json({ following: false });
  }
}
