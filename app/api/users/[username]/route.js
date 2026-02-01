import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const db = getDb();

    const user = db
      .prepare(
        `SELECT u.id, u.username, u.display_name, u.bio, u.avatar_url, u.created_at,
                (SELECT COUNT(*) FROM recipes WHERE user_id = u.id) as recipe_count,
                (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count,
                (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count
         FROM users u WHERE u.username = ?`
      )
      .get(params.username);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("GET /api/users/[username] error:", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
