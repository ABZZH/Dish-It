"use client";

import { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/recipes?search=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      }
      setLoading(false);
      setSearched(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Recipes</h1>

      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="Search for recipes, ingredients, cuisines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Searching...</p>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-4xl mb-4">&#128533;</p>
          <p className="text-gray-500 text-lg">
            No recipes found for &quot;{query}&quot;
          </p>
          <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {results.length} recipe{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}

      {!searched && !loading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">&#127860;</p>
          <p className="text-gray-500 text-lg">Start typing to search for recipes</p>
        </div>
      )}
    </div>
  );
}
