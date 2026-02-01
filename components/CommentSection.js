"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CommentSection({ recipeId, initialComments, loggedIn }) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    if (!loggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setContent("");
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div>
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder={loggedIn ? "Share your thoughts on this recipe..." : "Log in to leave a comment"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!loggedIn}
        />
        {loggedIn && (
          <div className="flex justify-end mt-2">
            <button type="submit" className="btn-primary text-sm" disabled={loading || !content.trim()}>
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        )}
        {!loggedIn && (
          <p className="text-sm text-gray-500 mt-2">
            <Link href="/login" className="text-brand-500 hover:text-brand-600 font-medium">
              Log in
            </Link>
            {" "}to join the conversation
          </p>
        )}
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/profile/${comment.username}`} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {comment.display_name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900 group-hover:text-brand-500 transition-colors text-sm">
                  {comment.display_name}
                </span>
              </Link>
              <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
            </div>
            <p className="text-gray-700 text-sm pl-10">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
