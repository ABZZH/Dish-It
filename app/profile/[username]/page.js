import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import RecipeCard from "@/components/RecipeCard";
import FollowButton from "@/components/FollowButton";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default function ProfilePage({ params }) {
  const db = getDb();

  const profileUser = db
    .prepare(
      `SELECT u.id, u.username, u.display_name, u.bio, u.avatar_url, u.created_at,
              (SELECT COUNT(*) FROM recipes WHERE user_id = u.id) as recipe_count,
              (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count,
              (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count
       FROM users u WHERE u.username = ?`
    )
    .get(params.username);

  if (!profileUser) {
    notFound();
  }

  const currentUser = getSession();
  const isOwnProfile = currentUser && currentUser.userId === profileUser.id;

  let isFollowing = false;
  if (currentUser && !isOwnProfile) {
    const follow = db
      .prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?")
      .get(currentUser.userId, profileUser.id);
    isFollowing = !!follow;
  }

  const recipes = db
    .prepare(
      `SELECT r.*,
              u.username, u.display_name, u.avatar_url,
              COUNT(DISTINCT l.id) as like_count,
              COUNT(DISTINCT c.id) as comment_count
       FROM recipes r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN likes l ON r.id = l.recipe_id
       LEFT JOIN comments c ON r.id = c.recipe_id
       WHERE r.user_id = ?
       GROUP BY r.id
       ORDER BY r.created_at DESC`
    )
    .all(profileUser.id);

  const joinDate = new Date(profileUser.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {profileUser.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{profileUser.display_name}</h1>
              {!isOwnProfile && currentUser && (
                <FollowButton
                  username={profileUser.username}
                  initialFollowing={isFollowing}
                />
              )}
            </div>
            <p className="text-gray-500 mb-2">@{profileUser.username}</p>
            {profileUser.bio && (
              <p className="text-gray-700 mb-3">{profileUser.bio}</p>
            )}
            <div className="flex items-center gap-6 text-sm">
              <span>
                <strong>{profileUser.recipe_count}</strong>{" "}
                <span className="text-gray-500">recipes</span>
              </span>
              <span>
                <strong>{profileUser.follower_count}</strong>{" "}
                <span className="text-gray-500">followers</span>
              </span>
              <span>
                <strong>{profileUser.following_count}</strong>{" "}
                <span className="text-gray-500">following</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Joined {joinDate}</p>
          </div>
          {isOwnProfile && (
            <div className="flex gap-2">
              <Link href="/settings" className="btn-secondary text-sm">
                Edit Profile
              </Link>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>

      {/* User's Recipes */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {isOwnProfile ? "My Recipes" : `Recipes by ${profileUser.display_name}`}
        </h2>
        {isOwnProfile && (
          <Link href="/recipes/new" className="btn-primary text-sm">
            + New Recipe
          </Link>
        )}
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-4xl mb-4">&#127859;</p>
          <p className="text-gray-500 text-lg">
            {isOwnProfile
              ? "You haven't shared any recipes yet."
              : "This user hasn't shared any recipes yet."}
          </p>
          {isOwnProfile && (
            <Link href="/recipes/new" className="btn-primary inline-block mt-4">
              Create Your First Recipe
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
