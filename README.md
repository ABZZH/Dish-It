# Dish It

A social media platform for food lovers to create, share, and discover recipes.

## Features

- **User Accounts** - Sign up, log in, and manage your profile
- **Create Recipes** - Share your culinary creations with title, ingredients, step-by-step instructions, prep/cook time, servings, difficulty, and category
- **Recipe Feed** - Browse the latest and most popular recipes on the home page
- **Explore & Filter** - Discover recipes by category (Italian, Asian, Indian, BBQ, Baking, and more)
- **Search** - Find recipes by title or description with real-time search
- **Likes** - Like your favorite recipes
- **Comments** - Discuss recipes with other users
- **Follow Users** - Follow other cooks and build your network
- **User Profiles** - View any user's profile and their recipe collection
- **Edit & Delete** - Manage your own recipes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite (via better-sqlite3)
- **Authentication**: Session-based with bcryptjs

## Getting Started

```bash
# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Sample Accounts

After seeding, you can log in with any of these accounts (password: `password123`):

| Email               | Username     | Display Name      |
|---------------------|--------------|-------------------|
| julia@example.com   | chefjulia    | Chef Julia        |
| marcus@example.com  | bakingboss   | Marcus the Baker  |
| vince@example.com   | veggievince  | Vince Green       |
| priya@example.com   | spicequeen   | Priya Sharma      |
| tony@example.com    | grillmaster  | Tony Flames       |
