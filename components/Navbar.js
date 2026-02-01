import Link from "next/link";
import { getSession } from "@/lib/auth";

export default function Navbar() {
  const user = getSession();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">&#127858;</span>
              <span className="text-xl font-bold text-brand-600">Dish It</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-brand-500 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/explore"
                className="text-gray-600 hover:text-brand-500 font-medium transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="text-gray-500 hover:text-brand-500 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
            {user ? (
              <>
                <Link href="/recipes/new" className="btn-primary text-sm">
                  + New Recipe
                </Link>
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-brand-500 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-600 hover:text-brand-500 font-medium">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
