import Link from "next/link";
import { getDb } from "@/lib/db";
import RecipeCard from "@/components/RecipeCard";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  "All",
  "Italian",
  "Asian",
  "Indian",
  "BBQ",
  "Baking",
  "Seafood",
  "Vegetarian",
  "Mexican",
  "Dessert",
  "Breakfast",
  "Soup",
  "Salad",
  "Other",
];

export default function ExplorePage({ searchParams }) {
  const category = searchParams.category || "All";
  const sort = searchParams.sort || "recent";

  let recipes = [];

  try {
    const db = getDb();

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

    const params = [];
    if (category !== "All") {
      query += " WHERE r.category = ?";
      params.push(category);
    }

    query += " GROUP BY r.id";

    if (sort === "popular") {
      query += " ORDER BY like_count DESC, r.created_at DESC";
    } else {
      query += " ORDER BY r.created_at DESC";
    }

    recipes = db.prepare(query).all(...params);
  } catch (err) {
    console.error("Failed to load recipes:", err);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Explore Recipes</h1>
      <p className="text-gray-500 mb-8">Discover delicious recipes from our community</p>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/explore?category=${cat === "All" ? "" : cat}&sort=${sort}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              (cat === "All" && !searchParams.category) || cat === category
                ? "bg-brand-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-4 mb-6">
        <Link
          href={`/explore?category=${category === "All" ? "" : category}&sort=recent`}
          className={`text-sm font-medium ${
            sort === "recent" ? "text-brand-600 border-b-2 border-brand-500" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Most Recent
        </Link>
        <Link
          href={`/explore?category=${category === "All" ? "" : category}&sort=popular`}
          className={`text-sm font-medium ${
            sort === "popular" ? "text-brand-600 border-b-2 border-brand-500" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Most Popular
        </Link>
      </div>

      {/* Recipe grid */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-4xl mb-4">&#128269;</p>
          <p className="text-gray-500 text-lg">No recipes found in this category.</p>
          <Link href="/explore" className="text-brand-500 hover:text-brand-600 font-medium mt-2 inline-block">
            Browse all recipes
          </Link>
        </div>
      )}
    </div>
  );
}
