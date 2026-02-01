import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const db = getDb();
    const comments = db
      .prepare(
        `SELECT c.*, u.username, u.display_name, u.avatar_url
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.recipe_id = ?
         ORDER BY c.created_at DESC`
      )
      .all(params.id);

    return NextResponse.json(comments);
  } catch (err) {
    console.error("GET /api/recipes/[id]/comments error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const user = getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const db = getDb();
    const result = db
      .prepare("INSERT INTO comments (user_id, recipe_id, content) VALUES (?, ?, ?)")
      .run(user.userId, params.id, content.trim());

    const comment = db
      .prepare(
        `SELECT c.*, u.username, u.display_name, u.avatar_url
         FROM comments c JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`
      )
      .get(result.lastInsertRowid);

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error("POST /api/recipes/[id]/comments error:", err);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
