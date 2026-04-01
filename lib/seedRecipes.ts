import { Recipe } from "@/models/Recipe";
import { starterRecipes } from "@/lib/starterRecipes";

declare global {
  var recipesSeeded: boolean | undefined;
}

export async function seedRecipesIfEmpty() {
  if (global.recipesSeeded) {
    return;
  }

  const count = await Recipe.countDocuments();

  if (count === 0) {
    await Recipe.insertMany(starterRecipes);
  }

  global.recipesSeeded = true;
}
