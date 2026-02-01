"use client";

import { useState } from "react";

export default function FollowButton({ username, initialFollowing }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${username}/follow`, { method: "POST" });
      const data = await res.json();
      setFollowing(data.following);
    } catch {
      // ignore
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        following
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
          : "bg-brand-500 text-white hover:bg-brand-600"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
