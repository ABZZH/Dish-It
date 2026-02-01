import Link from "next/link";

export default function RecipeCard({ recipe }) {
  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <Link href={`/recipes/${recipe.id}`} className="card group hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
        <span className="text-5xl group-hover:scale-110 transition-transform">
          {getCategoryEmoji(recipe.category)}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge bg-brand-50 text-brand-700">{recipe.category}</span>
          <span className="badge bg-gray-100 text-gray-600">{recipe.difficulty}</span>
        </div>
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {recipe.like_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {recipe.comment_count || 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-6 h-6 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-xs font-semibold">
            {recipe.display_name?.charAt(0) || "?"}
          </div>
          <span className="text-sm text-gray-600">{recipe.display_name || recipe.username}</span>
        </div>
      </div>
    </Link>
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
