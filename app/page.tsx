"use client";

import { useMemo, useState } from "react";
import { IngredientForm } from "@/components/IngredientForm";
import { RecipeCard } from "@/components/RecipeCard";
import type { RecipeSuggestion, SuggestResponseBody } from "@/types/recipe";

const popularIngredients = [
  "tomato",
  "onion",
  "garlic",
  "egg",
  "rice",
  "pasta",
  "flour",
  "milk",
  "butter",
  "olive oil",
  "chickpeas",
  "soy sauce",
  "bell pepper",
  "basil",
];

const FAVORITES_STORAGE_KEY = "dish-suggestion-helper-favorites";

function parseInputIngredients(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function getInitialFavorites(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [results, setResults] = useState<RecipeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [onlyTwoMissing, setOnlyTwoMissing] = useState(false);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>(getInitialFavorites);

  const filteredResults = useMemo(() => {
    if (!onlyTwoMissing) {
      return results;
    }

    return results.filter((recipe) => recipe.missingIngredients.length <= 2);
  }, [onlyTwoMissing, results]);

  const bestMatchId = filteredResults.length > 0 ? filteredResults[0].id : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationMessage("");
    setErrorMessage("");

    const ingredients = parseInputIngredients(ingredientInput);

    if (ingredients.length === 0) {
      setValidationMessage("Please enter at least one ingredient.");
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = (await response.json()) as SuggestResponseBody & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to fetch recipe suggestions.");
      }

      setResults(data.recipes || []);
    } catch (error) {
      console.error(error);
      setResults([]);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleFavorite(recipeId: string) {
    const isAlreadyFavorite = favoriteRecipeIds.includes(recipeId);

    const updated = isAlreadyFavorite
      ? favoriteRecipeIds.filter((id) => id !== recipeId)
      : [...favoriteRecipeIds, recipeId];

    setFavoriteRecipeIds(updated);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <main className="relative flex-1 overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(251,191,36,0.25),transparent_30%),radial-gradient(circle_at_75%_25%,rgba(16,185,129,0.24),transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ecfeff_100%)]" />

      <section className="mx-auto w-full max-w-5xl space-y-6">
        <header className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_20px_50px_rgba(2,6,23,0.08)] backdrop-blur">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Smart Cooking Assistant</p>
          <h1 className="font-[var(--font-fraunces)] text-4xl leading-tight text-slate-900 sm:text-5xl">
            Dish Suggestion Helper
          </h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Enter the ingredients you have, and discover the dishes you can make right now. Results are ranked by
            ingredient match.
          </p>
        </header>

        <IngredientForm
          value={ingredientInput}
          onChange={setIngredientInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          validationMessage={validationMessage}
          onlyTwoMissing={onlyTwoMissing}
          onOnlyTwoMissingChange={setOnlyTwoMissing}
          suggestions={popularIngredients}
        />

        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {filteredResults.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredResults.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isBestMatch={recipe.id === bestMatchId}
                isFavorite={favoriteRecipeIds.includes(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : null}

        {!isLoading && !errorMessage && results.length > 0 && filteredResults.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700">
            No recipes match your filter. Try disabling the missing-ingredient filter.
          </div>
        ) : null}
      </section>
    </main>
  );
}
