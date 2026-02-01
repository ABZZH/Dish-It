"use client";

import { useRouter } from "next/navigation";

export default function DeleteRecipeButton({ recipeId }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this recipe? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      alert("Failed to delete recipe. Please try again.");
    }
  }

  return (
    <button onClick={handleDelete} className="btn-danger text-sm">
      Delete
    </button>
  );
}
