import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const db = getDb();
    const recipe = db
      .prepare(
        `SELECT r.*,
                u.username, u.display_name, u.avatar_url,
                COUNT(DISTINCT l.id) as like_count,
                COUNT(DISTINCT c.id) as comment_count
         FROM recipes r
         JOIN users u ON r.user_id = u.id
         LEFT JOIN likes l ON r.id = l.recipe_id
         LEFT JOIN comments c ON r.id = c.recipe_id
         WHERE r.id = ?
         GROUP BY r.id`
      )
      .get(params.id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (err) {
    console.error("GET /api/recipes/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch recipe" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const recipe = db.prepare("SELECT * FROM recipes WHERE id = ?").get(params.id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.user_id !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    db.prepare(
      `UPDATE recipes SET title = ?, description = ?, image_url = ?, prep_time = ?, cook_time = ?,
       servings = ?, difficulty = ?, category = ?, ingredients = ?, instructions = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(
      title || recipe.title,
      description || recipe.description,
      image_url ?? recipe.image_url,
      prep_time ?? recipe.prep_time,
      cook_time ?? recipe.cook_time,
      servings ?? recipe.servings,
      difficulty || recipe.difficulty,
      category || recipe.category,
      ingredients ? (typeof ingredients === "string" ? ingredients : JSON.stringify(ingredients)) : recipe.ingredients,
      instructions ? (typeof instructions === "string" ? instructions : JSON.stringify(instructions)) : recipe.instructions,
      params.id
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/recipes/[id] error:", err);
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const recipe = db.prepare("SELECT * FROM recipes WHERE id = ?").get(params.id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.user_id !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    db.prepare("DELETE FROM recipes WHERE id = ?").run(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/recipes/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}
