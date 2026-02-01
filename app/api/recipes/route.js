import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const userId = searchParams.get("userId");
  const sort = searchParams.get("sort") || "recent";
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  let query = `
    SELECT r.*,
           u.username, u.display_name, u.avatar_url,
           COUNT(DISTINCT l.id) as like_count,
           COUNT(DISTINCT c.id) as comment_count
    FROM recipes r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN likes l ON r.id = l.recipe_id
    LEFT JOIN comments c ON r.id = c.recipe_id
  `;

  const conditions = [];
  const params = [];

  if (category) {
    conditions.push("r.category = ?");
    params.push(category);
  }

  if (search) {
    conditions.push("(r.title LIKE ? OR r.description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (userId) {
    conditions.push("r.user_id = ?");
    params.push(userId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " GROUP BY r.id";

  if (sort === "popular") {
    query += " ORDER BY like_count DESC, r.created_at DESC";
  } else {
    query += " ORDER BY r.created_at DESC";
  }

  query += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const recipes = db.prepare(query).all(...params);
  return NextResponse.json(recipes);
}

export async function POST(request) {
  const user = getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    description,
    image_url,
    prep_time,
    cook_time,
    servings,
    difficulty,
    category,
    ingredients,
    instructions,
  } = body;

  if (!title || !description || !ingredients || !instructions) {
    return NextResponse.json({ error: "Title, description, ingredients, and instructions are required" }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO recipes (user_id, title, description, image_url, prep_time, cook_time, servings, difficulty, category, ingredients, instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      user.userId,
      title,
      description,
      image_url || "",
      prep_time || 0,
      cook_time || 0,
      servings || 1,
      difficulty || "Easy",
      category || "Other",
      typeof ingredients === "string" ? ingredients : JSON.stringify(ingredients),
      typeof instructions === "string" ? instructions : JSON.stringify(instructions)
    );

  return NextResponse.json({ success: true, id: result.lastInsertRowid }, { status: 201 });
}
