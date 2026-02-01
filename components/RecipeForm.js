"use client";

import { useState } from "react";

const CATEGORIES = [
  "Italian",
  "Asian",
  "Indian",
  "BBQ",
  "Baking",
  "Seafood",
  "Vegetarian",
  "Mexican",
  "Dessert",
  "Breakfast",
  "Soup",
  "Salad",
  "Other",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function RecipeForm({ onSubmit, submitLabel, initialData }) {
  const parseList = (val) => {
    if (!val) return [""];
    if (Array.isArray(val)) return val.length ? val : [""];
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length ? parsed : [""];
    } catch {
      return [val];
    }
  };

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    prep_time: initialData?.prep_time || 0,
    cook_time: initialData?.cook_time || 0,
    servings: initialData?.servings || 1,
    difficulty: initialData?.difficulty || "Easy",
    category: initialData?.category || "Other",
  });

  const [ingredients, setIngredients] = useState(parseList(initialData?.ingredients));
  const [instructions, setInstructions] = useState(parseList(initialData?.instructions));
  const [loading, setLoading] = useState(false);

  function updateIngredient(index, value) {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  }

  function addIngredient() {
    setIngredients([...ingredients, ""]);
  }

  function removeIngredient(index) {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateInstruction(index, value) {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  }

  function addInstruction() {
    setInstructions([...instructions, ""]);
  }

  function removeInstruction(index) {
    if (instructions.length <= 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const filteredIngredients = ingredients.filter((i) => i.trim());
    const filteredInstructions = instructions.filter((i) => i.trim());

    if (filteredIngredients.length === 0) {
      alert("Please add at least one ingredient");
      setLoading(false);
      return;
    }

    if (filteredInstructions.length === 0) {
      alert("Please add at least one instruction");
      setLoading(false);
      return;
    }

    await onSubmit({
      ...form,
      ingredients: JSON.stringify(filteredIngredients),
      instructions: JSON.stringify(filteredInstructions),
    });

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Info</h2>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Recipe Title *
          </label>
          <input
            id="title"
            type="text"
            className="input-field"
            placeholder="e.g., Grandma's Chocolate Chip Cookies"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            className="input-field resize-none"
            rows={3}
            placeholder="Briefly describe your recipe..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="prep_time" className="block text-sm font-medium text-gray-700 mb-1">
              Prep Time (min)
            </label>
            <input
              id="prep_time"
              type="number"
              className="input-field"
              min="0"
              value={form.prep_time}
              onChange={(e) => setForm({ ...form, prep_time: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label htmlFor="cook_time" className="block text-sm font-medium text-gray-700 mb-1">
              Cook Time (min)
            </label>
            <input
              id="cook_time"
              type="number"
              className="input-field"
              min="0"
              value={form.cook_time}
              onChange={(e) => setForm({ ...form, cook_time: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
              Servings
            </label>
            <input
              id="servings"
              type="number"
              className="input-field"
              min="1"
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="input-field"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            className="input-field"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ingredients */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        {ingredients.map((ingredient, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              className="input-field"
              placeholder={`Ingredient ${i + 1}`}
              value={ingredient}
              onChange={(e) => updateIngredient(i, e.target.value)}
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="text-gray-400 hover:text-red-500 px-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="text-brand-500 hover:text-brand-600 text-sm font-medium"
        >
          + Add Ingredient
        </button>
      </div>

      {/* Instructions */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Instructions</h2>
        {instructions.map((instruction, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-2">
              {i + 1}
            </div>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder={`Step ${i + 1}`}
              value={instruction}
              onChange={(e) => updateInstruction(i, e.target.value)}
            />
            {instructions.length > 1 && (
              <button
                type="button"
                onClick={() => removeInstruction(i)}
                className="text-gray-400 hover:text-red-500 px-2 mt-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="text-brand-500 hover:text-brand-600 text-sm font-medium"
        >
          + Add Step
        </button>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
