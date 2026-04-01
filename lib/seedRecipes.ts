import { Recipe } from "@/models/Recipe";
import { starterRecipes } from "@/lib/starterRecipes";

export async function seedRecipesIfEmpty() {
  const count = await Recipe.countDocuments();

  if (count === 0) {
    await Recipe.insertMany(starterRecipes);
  }
}
