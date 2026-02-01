import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Dish It - Share Your Recipes",
  description: "A social platform for food lovers to create, share, and discover amazing recipes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p className="font-semibold text-brand-500 text-lg mb-1">Dish It</p>
            <p>Share your recipes with the world.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
