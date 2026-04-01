export type RecipeSuggestion = {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
  matchedIngredients: string[];
  missingIngredients: string[];
  matchScore: number;
};

export type SuggestRequestBody = {
  ingredients: string[];
};

export type SuggestResponseBody = {
  recipes: RecipeSuggestion[];
};
