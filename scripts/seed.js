const { getDb } = require("../lib/db");
const bcrypt = require("bcryptjs");

const db = getDb();

const USERS = [
  {
    username: "chefjulia",
    email: "julia@example.com",
    password: "password123",
    display_name: "Chef Julia",
    bio: "Professional chef with 15 years of experience. Love sharing classic recipes with a modern twist!",
    avatar_url: "",
  },
  {
    username: "bakingboss",
    email: "marcus@example.com",
    password: "password123",
    display_name: "Marcus the Baker",
    bio: "Pastry chef and bread enthusiast. If it involves flour, I'm in!",
    avatar_url: "",
  },
  {
    username: "veggievince",
    email: "vince@example.com",
    password: "password123",
    display_name: "Vince Green",
    bio: "Plant-based cooking advocate. Proving that veggies can be the star of every meal.",
    avatar_url: "",
  },
  {
    username: "spicequeen",
    email: "priya@example.com",
    password: "password123",
    display_name: "Priya Sharma",
    bio: "Bringing the bold flavors of South Asian cuisine to your kitchen. Spice is life!",
    avatar_url: "",
  },
  {
    username: "grillmaster",
    email: "tony@example.com",
    password: "password123",
    display_name: "Tony Flames",
    bio: "BBQ and grilling specialist. Weekend warrior of the backyard grill.",
    avatar_url: "",
  },
];

const RECIPES = [
  {
    user_index: 0,
    title: "Classic Margherita Pizza",
    description: "A simple yet perfect Margherita pizza with San Marzano tomatoes, fresh mozzarella, and fragrant basil.",
    image_url: "",
    prep_time: 30,
    cook_time: 15,
    servings: 4,
    difficulty: "Medium",
    category: "Italian",
    ingredients: JSON.stringify([
      "2 1/4 tsp active dry yeast",
      "1 cup warm water",
      "3 cups all-purpose flour",
      "1 tsp salt",
      "1 tbsp olive oil",
      "1 can San Marzano tomatoes",
      "8 oz fresh mozzarella",
      "Fresh basil leaves",
      "Extra virgin olive oil for drizzling",
    ]),
    instructions: JSON.stringify([
      "Dissolve yeast in warm water and let sit for 5 minutes until foamy.",
      "Mix flour and salt, then add yeast mixture and olive oil. Knead for 8 minutes until smooth.",
      "Let dough rise in a covered bowl for 1 hour until doubled in size.",
      "Crush San Marzano tomatoes by hand and season with salt.",
      "Preheat oven to 500°F (260°C) with a pizza stone if available.",
      "Stretch dough into a 12-inch circle on a floured surface.",
      "Spread crushed tomatoes, add torn mozzarella pieces.",
      "Bake for 12-15 minutes until crust is golden and cheese is bubbly.",
      "Top with fresh basil leaves and a drizzle of olive oil before serving.",
    ]),
  },
  {
    user_index: 0,
    title: "Creamy Garlic Tuscan Shrimp",
    description: "Juicy shrimp in a rich and creamy garlic parmesan sauce with sun-dried tomatoes and spinach.",
    image_url: "",
    prep_time: 10,
    cook_time: 20,
    servings: 4,
    difficulty: "Easy",
    category: "Seafood",
    ingredients: JSON.stringify([
      "1 lb large shrimp, peeled and deveined",
      "3 cloves garlic, minced",
      "1/2 cup sun-dried tomatoes, chopped",
      "1 cup heavy cream",
      "1/2 cup parmesan cheese, grated",
      "2 cups fresh spinach",
      "2 tbsp olive oil",
      "1 tsp Italian seasoning",
      "Salt and pepper to taste",
    ]),
    instructions: JSON.stringify([
      "Season shrimp with Italian seasoning, salt, and pepper.",
      "Heat olive oil in a large skillet over medium-high heat.",
      "Cook shrimp for 2 minutes per side until pink. Remove and set aside.",
      "In the same skillet, sauté garlic for 30 seconds until fragrant.",
      "Add sun-dried tomatoes and cook for 2 minutes.",
      "Pour in heavy cream and bring to a simmer.",
      "Stir in parmesan cheese until melted and smooth.",
      "Add spinach and cook until wilted, about 2 minutes.",
      "Return shrimp to the skillet and toss to coat. Serve immediately.",
    ]),
  },
  {
    user_index: 1,
    title: "Sourdough Bread",
    description: "A beautifully crusty sourdough loaf with a soft, tangy crumb. Worth every minute of the wait!",
    image_url: "",
    prep_time: 60,
    cook_time: 45,
    servings: 8,
    difficulty: "Hard",
    category: "Baking",
    ingredients: JSON.stringify([
      "500g bread flour",
      "350g water",
      "100g active sourdough starter",
      "10g salt",
    ]),
    instructions: JSON.stringify([
      "Mix flour and water, let rest for 30 minutes (autolyse).",
      "Add sourdough starter and salt, mix until well combined.",
      "Perform stretch and folds every 30 minutes for the next 2 hours.",
      "Let the dough bulk ferment at room temperature for 4-6 hours until doubled.",
      "Shape the dough into a boule and place in a floured banneton.",
      "Refrigerate overnight (12-16 hours) for cold fermentation.",
      "Preheat oven to 500°F with a Dutch oven inside for 1 hour.",
      "Score the dough, place in the Dutch oven, and bake covered for 20 minutes.",
      "Remove lid and bake for another 20-25 minutes until deep golden brown.",
      "Let cool completely on a wire rack before slicing.",
    ]),
  },
  {
    user_index: 1,
    title: "Cinnamon Rolls",
    description: "Soft, fluffy cinnamon rolls with a gooey brown sugar filling and cream cheese frosting.",
    image_url: "",
    prep_time: 45,
    cook_time: 25,
    servings: 12,
    difficulty: "Medium",
    category: "Baking",
    ingredients: JSON.stringify([
      "4 cups all-purpose flour",
      "1/3 cup sugar",
      "1 packet instant yeast",
      "1 cup warm milk",
      "1/3 cup butter, melted",
      "2 eggs",
      "1 tsp salt",
      "1 cup brown sugar",
      "3 tbsp cinnamon",
      "1/3 cup softened butter for filling",
      "4 oz cream cheese",
      "2 cups powdered sugar",
      "1 tsp vanilla extract",
    ]),
    instructions: JSON.stringify([
      "Mix warm milk, sugar, and yeast. Let sit for 5 minutes.",
      "Add melted butter, eggs, salt, and flour. Knead into soft dough.",
      "Let rise for 1 hour in a warm spot.",
      "Roll dough into a large rectangle, about 16x12 inches.",
      "Spread softened butter over dough, then sprinkle brown sugar and cinnamon.",
      "Roll up tightly from the long side and cut into 12 equal pieces.",
      "Place in a greased 9x13 baking dish. Let rise for 30 minutes.",
      "Bake at 350°F for 22-25 minutes until golden.",
      "Beat cream cheese, powdered sugar, and vanilla for frosting.",
      "Spread frosting over warm rolls and serve.",
    ]),
  },
  {
    user_index: 2,
    title: "Thai Green Curry with Tofu",
    description: "A fragrant and spicy Thai green curry loaded with vegetables and crispy tofu.",
    image_url: "",
    prep_time: 15,
    cook_time: 25,
    servings: 4,
    difficulty: "Easy",
    category: "Asian",
    ingredients: JSON.stringify([
      "14 oz extra-firm tofu, pressed and cubed",
      "1 can coconut milk",
      "3 tbsp green curry paste",
      "1 red bell pepper, sliced",
      "1 zucchini, sliced",
      "1 cup snap peas",
      "1 cup Thai basil leaves",
      "2 tbsp soy sauce",
      "1 tbsp brown sugar",
      "Juice of 1 lime",
      "Jasmine rice for serving",
    ]),
    instructions: JSON.stringify([
      "Press tofu for 15 minutes, then cut into cubes.",
      "Pan-fry tofu in oil until golden and crispy on all sides. Set aside.",
      "In the same pan, heat a splash of coconut milk and fry curry paste for 1 minute.",
      "Add remaining coconut milk, soy sauce, and brown sugar. Bring to a simmer.",
      "Add bell pepper, zucchini, and snap peas. Cook for 5-7 minutes.",
      "Return tofu to the pan and stir gently.",
      "Finish with lime juice and fresh Thai basil.",
      "Serve over steamed jasmine rice.",
    ]),
  },
  {
    user_index: 2,
    title: "Mediterranean Stuffed Bell Peppers",
    description: "Colorful bell peppers stuffed with quinoa, chickpeas, sun-dried tomatoes, and feta cheese.",
    image_url: "",
    prep_time: 20,
    cook_time: 35,
    servings: 4,
    difficulty: "Easy",
    category: "Vegetarian",
    ingredients: JSON.stringify([
      "4 large bell peppers",
      "1 cup quinoa, cooked",
      "1 can chickpeas, drained",
      "1/2 cup sun-dried tomatoes, chopped",
      "1/4 cup kalamata olives, sliced",
      "1/2 cup feta cheese, crumbled",
      "2 cloves garlic, minced",
      "1 tsp cumin",
      "1 tsp paprika",
      "Fresh parsley for garnish",
      "2 tbsp olive oil",
    ]),
    instructions: JSON.stringify([
      "Preheat oven to 375°F (190°C).",
      "Cut tops off bell peppers and remove seeds.",
      "In a bowl, mix cooked quinoa, chickpeas, sun-dried tomatoes, olives, garlic, cumin, and paprika.",
      "Stir in half the feta cheese and drizzle with olive oil.",
      "Stuff each pepper with the quinoa mixture.",
      "Place in a baking dish with a splash of water at the bottom.",
      "Bake for 30-35 minutes until peppers are tender.",
      "Top with remaining feta and fresh parsley before serving.",
    ]),
  },
  {
    user_index: 3,
    title: "Butter Chicken",
    description: "Rich, creamy, and mildly spiced butter chicken that's better than any takeout.",
    image_url: "",
    prep_time: 20,
    cook_time: 40,
    servings: 6,
    difficulty: "Medium",
    category: "Indian",
    ingredients: JSON.stringify([
      "2 lbs chicken thighs, cut into pieces",
      "1 cup yogurt",
      "2 tbsp garam masala",
      "1 tbsp turmeric",
      "1 tbsp cumin",
      "1 can crushed tomatoes",
      "1 cup heavy cream",
      "4 tbsp butter",
      "1 large onion, diced",
      "4 cloves garlic, minced",
      "2 inch ginger, grated",
      "1 tsp chili powder",
      "Fresh cilantro for garnish",
      "Basmati rice or naan for serving",
    ]),
    instructions: JSON.stringify([
      "Marinate chicken in yogurt, garam masala, turmeric, and cumin for at least 1 hour.",
      "Melt 2 tbsp butter in a large pot. Cook chicken until browned. Set aside.",
      "Add remaining butter, cook onion until softened.",
      "Add garlic and ginger, sauté for 1 minute.",
      "Pour in crushed tomatoes and chili powder. Simmer for 15 minutes.",
      "Blend the sauce until smooth (or use an immersion blender).",
      "Return chicken to the sauce and simmer for 15 minutes.",
      "Stir in heavy cream and cook for 5 more minutes.",
      "Garnish with cilantro and serve with basmati rice or warm naan.",
    ]),
  },
  {
    user_index: 3,
    title: "Spicy Lamb Biryani",
    description: "A layered rice dish with tender spiced lamb, fragrant basmati, and caramelized onions.",
    image_url: "",
    prep_time: 30,
    cook_time: 60,
    servings: 6,
    difficulty: "Hard",
    category: "Indian",
    ingredients: JSON.stringify([
      "1.5 lbs lamb, cut into chunks",
      "2 cups basmati rice",
      "3 large onions, thinly sliced",
      "1 cup yogurt",
      "4 cloves garlic, minced",
      "2 inch ginger, grated",
      "2 tsp biryani masala",
      "1 tsp turmeric",
      "1 tsp red chili powder",
      "1/2 tsp saffron in 3 tbsp warm milk",
      "Fresh mint and cilantro",
      "3 tbsp ghee",
      "Whole spices: 4 cardamom, 4 cloves, 1 cinnamon stick",
    ]),
    instructions: JSON.stringify([
      "Soak basmati rice for 30 minutes, then parboil until 70% cooked. Drain.",
      "Fry sliced onions in ghee until deep golden brown. Set half aside for garnish.",
      "Add whole spices, garlic, and ginger to the pot. Cook for 1 minute.",
      "Add lamb and brown on all sides.",
      "Stir in yogurt, biryani masala, turmeric, and chili powder. Cook for 20 minutes.",
      "Layer parboiled rice over the lamb mixture.",
      "Drizzle saffron milk over the rice and top with mint and cilantro.",
      "Cover tightly with foil and lid. Cook on low heat for 25 minutes.",
      "Let rest for 10 minutes, then gently mix layers when serving.",
      "Garnish with fried onions and fresh herbs.",
    ]),
  },
  {
    user_index: 4,
    title: "Smoked BBQ Brisket",
    description: "Low and slow smoked brisket with a peppery bark and melt-in-your-mouth tenderness.",
    image_url: "",
    prep_time: 30,
    cook_time: 720,
    servings: 12,
    difficulty: "Hard",
    category: "BBQ",
    ingredients: JSON.stringify([
      "12 lb whole packer brisket",
      "1/4 cup coarse black pepper",
      "1/4 cup kosher salt",
      "2 tbsp garlic powder",
      "1 tbsp onion powder",
      "1 tbsp paprika",
      "Yellow mustard for binder",
      "Apple cider vinegar for spritzing",
      "Butcher paper for wrapping",
    ]),
    instructions: JSON.stringify([
      "Trim brisket, leaving about 1/4 inch of fat cap.",
      "Apply a thin layer of yellow mustard as a binder.",
      "Mix all dry spices and coat the brisket generously.",
      "Let the brisket rest at room temperature for 1 hour.",
      "Set smoker to 250°F using oak or hickory wood.",
      "Place brisket fat-side up and smoke for 6-8 hours.",
      "Spritz with apple cider vinegar every hour after the first 3 hours.",
      "When bark is set and internal temp hits 165°F, wrap in butcher paper.",
      "Continue smoking until internal temperature reaches 200-205°F.",
      "Rest in a cooler for at least 1 hour before slicing against the grain.",
    ]),
  },
  {
    user_index: 4,
    title: "Grilled Honey Garlic Chicken Wings",
    description: "Crispy grilled wings tossed in a sticky honey garlic glaze. Perfect game day snack!",
    image_url: "",
    prep_time: 15,
    cook_time: 30,
    servings: 6,
    difficulty: "Easy",
    category: "BBQ",
    ingredients: JSON.stringify([
      "3 lbs chicken wings",
      "1/3 cup honey",
      "4 cloves garlic, minced",
      "3 tbsp soy sauce",
      "2 tbsp sriracha",
      "1 tbsp rice vinegar",
      "1 tbsp sesame oil",
      "1 tsp ginger, grated",
      "Sesame seeds for garnish",
      "Green onions, sliced",
      "Salt and pepper",
    ]),
    instructions: JSON.stringify([
      "Pat wings dry and season generously with salt and pepper.",
      "Preheat grill to medium-high heat (400°F).",
      "Grill wings for 20-25 minutes, flipping every 5 minutes, until cooked through.",
      "While grilling, combine honey, garlic, soy sauce, sriracha, rice vinegar, sesame oil, and ginger in a saucepan.",
      "Simmer the sauce for 5 minutes until slightly thickened.",
      "Toss grilled wings in the honey garlic sauce.",
      "Garnish with sesame seeds and green onions.",
      "Serve immediately with extra sauce on the side.",
    ]),
  },
];

function seed() {
  console.log("Seeding database...");

  // Clear existing data
  db.exec("DELETE FROM comments");
  db.exec("DELETE FROM likes");
  db.exec("DELETE FROM follows");
  db.exec("DELETE FROM recipes");
  db.exec("DELETE FROM sessions");
  db.exec("DELETE FROM users");

  // Insert users
  const insertUser = db.prepare(`
    INSERT INTO users (username, email, password_hash, display_name, bio, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const userIds = [];
  for (const user of USERS) {
    const hash = bcrypt.hashSync(user.password, 10);
    const result = insertUser.run(
      user.username,
      user.email,
      hash,
      user.display_name,
      user.bio,
      user.avatar_url
    );
    userIds.push(result.lastInsertRowid);
  }
  console.log(`Created ${userIds.length} users`);

  // Insert recipes
  const insertRecipe = db.prepare(`
    INSERT INTO recipes (user_id, title, description, image_url, prep_time, cook_time, servings, difficulty, category, ingredients, instructions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const recipeIds = [];
  for (const recipe of RECIPES) {
    const result = insertRecipe.run(
      userIds[recipe.user_index],
      recipe.title,
      recipe.description,
      recipe.image_url,
      recipe.prep_time,
      recipe.cook_time,
      recipe.servings,
      recipe.difficulty,
      recipe.category,
      recipe.ingredients,
      recipe.instructions
    );
    recipeIds.push(result.lastInsertRowid);
  }
  console.log(`Created ${recipeIds.length} recipes`);

  // Add some likes
  const insertLike = db.prepare("INSERT OR IGNORE INTO likes (user_id, recipe_id) VALUES (?, ?)");
  const likeData = [
    [userIds[0], recipeIds[2]], [userIds[0], recipeIds[4]], [userIds[0], recipeIds[6]],
    [userIds[1], recipeIds[0]], [userIds[1], recipeIds[5]], [userIds[1], recipeIds[8]],
    [userIds[2], recipeIds[0]], [userIds[2], recipeIds[1]], [userIds[2], recipeIds[6]],
    [userIds[3], recipeIds[0]], [userIds[3], recipeIds[2]], [userIds[3], recipeIds[8]],
    [userIds[4], recipeIds[3]], [userIds[4], recipeIds[6]], [userIds[4], recipeIds[7]],
  ];
  for (const [uid, rid] of likeData) {
    insertLike.run(uid, rid);
  }
  console.log(`Created ${likeData.length} likes`);

  // Add some comments
  const insertComment = db.prepare("INSERT INTO comments (user_id, recipe_id, content) VALUES (?, ?, ?)");
  const commentData = [
    [userIds[1], recipeIds[0], "This is my go-to pizza recipe now! The crust is perfection."],
    [userIds[2], recipeIds[0], "Made this last night and my family loved it. So simple yet so good!"],
    [userIds[3], recipeIds[2], "I've been trying to master sourdough for months. This guide finally helped me get that perfect crumb!"],
    [userIds[0], recipeIds[4], "Added some mushrooms and it was incredible. Great base recipe!"],
    [userIds[4], recipeIds[6], "The butter chicken turned out amazing! Just like my favorite restaurant."],
    [userIds[1], recipeIds[8], "12 hours is a commitment but SO worth it. Best brisket I've ever made."],
    [userIds[2], recipeIds[3], "These cinnamon rolls disappeared in minutes at our brunch!"],
    [userIds[0], recipeIds[9], "The honey garlic glaze is addictive. Made a double batch of sauce!"],
  ];
  for (const [uid, rid, content] of commentData) {
    insertComment.run(uid, rid, content);
  }
  console.log(`Created ${commentData.length} comments`);

  // Add some follows
  const insertFollow = db.prepare("INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)");
  const followData = [
    [userIds[0], userIds[1]], [userIds[0], userIds[3]],
    [userIds[1], userIds[0]], [userIds[1], userIds[2]],
    [userIds[2], userIds[0]], [userIds[2], userIds[3]],
    [userIds[3], userIds[0]], [userIds[3], userIds[4]],
    [userIds[4], userIds[0]], [userIds[4], userIds[3]],
  ];
  for (const [fid, tid] of followData) {
    insertFollow.run(fid, tid);
  }
  console.log(`Created ${followData.length} follows`);

  console.log("Seed complete!");
}

seed();
