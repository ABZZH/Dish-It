import Link from "next/link";
import { getDb } from "@/lib/db";
import RecipeCard from "@/components/RecipeCard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  let recipes = [];
  let popularRecipes = [];

  try {
    const db = getDb();

    recipes = db
      .prepare(
        `SELECT r.*,
                u.username, u.display_name, u.avatar_url,
                COUNT(DISTINCT l.id) as like_count,
                COUNT(DISTINCT c.id) as comment_count
         FROM recipes r
         JOIN users u ON r.user_id = u.id
         LEFT JOIN likes l ON r.id = l.recipe_id
         LEFT JOIN comments c ON r.id = c.recipe_id
         GROUP BY r.id
         ORDER BY r.created_at DESC
         LIMIT 20`
      )
      .all();

    popularRecipes = db
      .prepare(
        `SELECT r.*,
                u.username, u.display_name, u.avatar_url,
                COUNT(DISTINCT l.id) as like_count,
                COUNT(DISTINCT c.id) as comment_count
         FROM recipes r
         JOIN users u ON r.user_id = u.id
         LEFT JOIN likes l ON r.id = l.recipe_id
         LEFT JOIN comments c ON r.id = c.recipe_id
         GROUP BY r.id
         ORDER BY like_count DESC
         LIMIT 4`
      )
      .all();
  } catch (err) {
    console.error("Failed to load recipes:", err);
  }

  const categories = [
    { name: "Italian", emoji: "\u{1F35D}" },
    { name: "Asian", emoji: "\u{1F35C}" },
    { name: "Indian", emoji: "\u{1F35B}" },
    { name: "BBQ", emoji: "\u{1F525}" },
    { name: "Baking", emoji: "\u{1F35E}" },
    { name: "Seafood", emoji: "\u{1F990}" },
    { name: "Vegetarian", emoji: "\u{1F966}" },
    { name: "Mexican", emoji: "\u{1F32E}" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Share Your Culinary Creations
            </h1>
            <p className="text-lg md:text-xl text-brand-100 mb-8">
              Dish It is where food lovers come together to share recipes,
              discover new flavors, and connect with fellow home cooks.
            </p>
            <div className="flex gap-4">
              <Link
                href="/explore"
                className="bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
              >
                Explore Recipes
              </Link>
              <Link
                href="/signup"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/explore?category=${cat.name}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-300 hover:shadow-sm transition-all"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Recipes */}
      {popularRecipes.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Recipes</h2>
            <Link href="/explore?sort=popular" className="text-brand-500 hover:text-brand-600 font-medium text-sm">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Recipes */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Recipes</h2>
          <Link href="/explore" className="text-brand-500 hover:text-brand-600 font-medium text-sm">
            View all
          </Link>
        </div>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-4xl mb-4">&#127859;</p>
            <p className="text-gray-500 text-lg">No recipes yet. Be the first to share one!</p>
            <Link href="/recipes/new" className="btn-primary inline-block mt-4">
              Create a Recipe
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
