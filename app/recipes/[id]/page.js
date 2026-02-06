import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";

export const dynamic = "force-dynamic";

export default function RecipeDetailPage({ params }) {
  let db;
  try {
    db = getDb();
  } catch (err) {
    console.error("Failed to connect to database:", err);
    notFound();
  }

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
    notFound();
  }

  let user = null;
  try {
    user = getSession();
  } catch {
    // not logged in
  }

  const isOwner = user && user.userId === recipe.user_id;

  let liked = false;
  if (user) {
    try {
      const likeRow = db
        .prepare("SELECT id FROM likes WHERE user_id = ? AND recipe_id = ?")
        .get(user.userId, recipe.id);
      liked = !!likeRow;
    } catch {
      // ignore like check failure
    }
  }

  let comments = [];
  try {
    comments = db
      .prepare(
        `SELECT c.*, u.username, u.display_name, u.avatar_url
         FROM comments c JOIN users u ON c.user_id = u.id
         WHERE c.recipe_id = ?
         ORDER BY c.created_at DESC`
      )
      .all(recipe.id);
  } catch {
    // ignore comment load failure
  }

  let ingredients = [];
  let instructions = [];
  try {
    ingredients = JSON.parse(recipe.ingredients);
  } catch {
    ingredients = [recipe.ingredients];
  }
  try {
    instructions = JSON.parse(recipe.instructions);
  } catch {
    instructions = [recipe.instructions];
  }

  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/explore" className="text-gray-500 hover:text-brand-500 text-sm">
            Explore
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">{recipe.category}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{recipe.title}</h1>
            <p className="text-lg text-gray-600">{recipe.description}</p>
          </div>
          {isOwner && (
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="btn-secondary text-sm"
              >
                Edit
              </Link>
              <DeleteRecipeButton recipeId={recipe.id} />
            </div>
          )}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mt-4">
          <Link href={`/profile/${recipe.username}`} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-semibold">
              {recipe.display_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-brand-500 transition-colors">
                {recipe.display_name}
              </p>
              <p className="text-sm text-gray-500">@{recipe.username}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recipe Image Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center mb-8">
        <span className="text-8xl">{getCategoryEmoji(recipe.category)}</span>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-500">Prep Time</p>
          <p className="text-lg font-semibold">{recipe.prep_time} min</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-500">Cook Time</p>
          <p className="text-lg font-semibold">{recipe.cook_time} min</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-500">Total Time</p>
          <p className="text-lg font-semibold">{totalTime} min</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-500">Servings</p>
          <p className="text-lg font-semibold">{recipe.servings}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-500">Difficulty</p>
          <p className="text-lg font-semibold">{recipe.difficulty}</p>
        </div>
      </div>

      {/* Like and social */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
        <LikeButton
          recipeId={recipe.id}
          initialLiked={liked}
          initialCount={recipe.like_count}
          loggedIn={!!user}
        />
        <span className="text-gray-400">|</span>
        <span className="text-sm text-gray-500">
          {recipe.comment_count} comment{recipe.comment_count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Ingredients */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <div className="card p-6">
          <ul className="space-y-3">
            {ingredients.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 mt-0.5 rounded border-2 border-brand-300 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <div className="space-y-4">
          {instructions.map((step, i) => (
            <div key={i} className="card p-6 flex gap-4">
              <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-gray-700 pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>
        <CommentSection
          recipeId={recipe.id}
          initialComments={comments}
          loggedIn={!!user}
        />
      </div>
    </div>
  );
}

function getCategoryEmoji(category) {
  const map = {
    Italian: "\u{1F35D}",
    Seafood: "\u{1F990}",
    Baking: "\u{1F35E}",
    Asian: "\u{1F35C}",
    Vegetarian: "\u{1F966}",
    Indian: "\u{1F35B}",
    BBQ: "\u{1F525}",
    Mexican: "\u{1F32E}",
    Dessert: "\u{1F370}",
    Breakfast: "\u{1F373}",
    Salad: "\u{1F957}",
    Soup: "\u{1F372}",
    Other: "\u{1F37D}",
  };
  return map[category] || "\u{1F37D}";
}
