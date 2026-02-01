"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";

export default function NewRecipePage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(data) {
    setError("");

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to create recipe");
        return;
      }

      router.push(`/recipes/${result.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Create a New Recipe</h1>
      <p className="text-gray-500 mb-8">Share your culinary creation with the community</p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
      )}

      <RecipeForm onSubmit={handleSubmit} submitLabel="Publish Recipe" />
    </div>
  );
}
