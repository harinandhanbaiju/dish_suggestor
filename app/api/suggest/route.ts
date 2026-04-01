import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { normalizeIngredientList } from "@/lib/normalize";
import { seedRecipesIfEmpty } from "@/lib/seedRecipes";
import { starterRecipes } from "@/lib/starterRecipes";
import { Recipe } from "@/models/Recipe";
import type { RecipeSuggestion, SuggestRequestBody, SuggestResponseBody } from "@/types/recipe";

type RecipeLike = {
  _id?: unknown;
  name: string;
  ingredients: string[];
  steps: string[];
};

function sanitizeIngredient(input: string): string {
  // Keep letters, numbers, spaces and common cooking punctuation only.
  return input.replace(/[^a-zA-Z0-9\s\-_'()/]/g, "");
}

function parseIngredients(rawIngredients: unknown): string[] {
  if (!Array.isArray(rawIngredients)) {
    return [];
  }

  const safeIngredients = rawIngredients
    .filter((item): item is string => typeof item === "string")
    .map((item) => sanitizeIngredient(item));

  return normalizeIngredientList(safeIngredients);
}

function buildSuggestions(recipes: RecipeLike[], userIngredients: string[]): RecipeSuggestion[] {
  const userSet = new Set(userIngredients);

  return recipes
    .map((recipe, index) => {
      const normalizedRecipeIngredients = normalizeIngredientList(recipe.ingredients || []);

      const matchedIngredients = normalizedRecipeIngredients.filter((item) => userSet.has(item));
      const missingIngredients = normalizedRecipeIngredients.filter((item) => !userSet.has(item));
      const total = normalizedRecipeIngredients.length || 1;
      const matchScore = matchedIngredients.length / total;

      return {
        id: recipe._id ? String(recipe._id) : `starter-${index}`,
        name: recipe.name,
        ingredients: normalizedRecipeIngredients,
        steps: recipe.steps || [],
        matchedIngredients,
        missingIngredients,
        matchScore,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export async function POST(request: Request) {
  try {
    let body: SuggestRequestBody;

    try {
      body = (await request.json()) as SuggestRequestBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const userIngredients = parseIngredients(body.ingredients);

    if (userIngredients.length === 0) {
      return NextResponse.json({ error: "Please provide at least one valid ingredient." }, { status: 422 });
    }

    let recipes: RecipeLike[] = starterRecipes;

    try {
      await connectToDatabase();
      await seedRecipesIfEmpty();
      recipes = await Recipe.find().select("name ingredients steps").lean();
    } catch (databaseError) {
      console.warn("Database unavailable. Using in-memory starter recipes.", databaseError);
    }

    const suggestions = buildSuggestions(recipes, userIngredients);

    const response: SuggestResponseBody = {
      recipes: suggestions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to suggest recipes:", error);
    return NextResponse.json(
      { error: "Something went wrong while suggesting dishes. Please try again." },
      { status: 500 }
    );
  }
}
