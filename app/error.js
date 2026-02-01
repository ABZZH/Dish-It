"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">&#128557;</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6">
          We ran into an issue loading this page.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-white text-gray-700 px-6 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
