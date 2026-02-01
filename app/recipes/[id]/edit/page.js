"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipe() {
      try {
        const res = await fetch(`/api/recipes/${params.id}`);
        if (!res.ok) {
          setError("Recipe not found");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setRecipe(data);
      } catch {
        setError("Failed to load recipe");
      }
      setLoading(false);
    }
    loadRecipe();
  }, [params.id]);

  async function handleSubmit(data) {
    setError("");

    try {
      const res = await fetch(`/api/recipes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to update recipe");
        return;
      }

      router.push(`/recipes/${params.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Edit Recipe</h1>
      <p className="text-gray-500 mb-8">Update your recipe details</p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
      )}

      <RecipeForm onSubmit={handleSubmit} submitLabel="Save Changes" initialData={recipe} />
    </div>
  );
}
