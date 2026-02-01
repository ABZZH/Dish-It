"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LikeButton({ recipeId, initialLiked, initialCount, loggedIn }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const router = useRouter();

  async function handleLike() {
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      const res = await fetch(`/api/recipes/${recipeId}/like`, { method: "POST" });
      const data = await res.json();
      setLiked(data.liked);
    } catch {
      setLiked(liked);
      setCount(count);
    }
  }

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        liked
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
