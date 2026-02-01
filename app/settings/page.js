"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setForm({
          display_name: data.displayName || "",
          bio: data.bio || "",
        });
      } catch {
        router.push("/login");
      }
      setPageLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      } else {
        setSuccess("Profile updated successfully!");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your profile</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">{success}</div>
        )}

        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            id="display_name"
            type="text"
            className="input-field"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            className="input-field resize-none"
            rows={4}
            placeholder="Tell us about yourself..."
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
