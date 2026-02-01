"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">&#128557;</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-6">
            We hit an unexpected error. Please try again.
          </p>
          <button
            onClick={() => reset()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
