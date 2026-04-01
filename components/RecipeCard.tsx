import type { RecipeSuggestion } from "@/types/recipe";

type RecipeCardProps = {
  recipe: RecipeSuggestion;
  isBestMatch: boolean;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
};

export function RecipeCard({ recipe, isBestMatch, isFavorite, onToggleFavorite }: RecipeCardProps) {
  const scorePercent = Math.round(recipe.matchScore * 100);

  return (
    <article className="relative rounded-2xl border border-white/40 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-[var(--font-fraunces)] text-2xl leading-tight text-slate-900">{recipe.name}</h3>
          <p className="mt-1 text-sm font-medium text-emerald-800">Match Score: {scorePercent}%</p>
        </div>

        <div className="flex items-center gap-2">
          {isBestMatch ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
              Best Match
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => onToggleFavorite(recipe.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              isFavorite
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          >
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-700">
        You are missing <span className="font-bold text-rose-600">{recipe.missingIngredients.length}</span> ingredients.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">Ingredients Required</h4>
          <ul className="space-y-1 text-sm text-slate-800">
            {recipe.ingredients.map((item) => (
              <li key={item} className="capitalize">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">Missing Ingredients</h4>
          {recipe.missingIngredients.length === 0 ? (
            <p className="text-sm font-semibold text-emerald-700">No missing ingredients. You can cook this now.</p>
          ) : (
            <ul className="space-y-1 text-sm text-rose-600">
              {recipe.missingIngredients.map((item) => (
                <li key={item} className="capitalize">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">Cooking Steps</h4>
        <ol className="space-y-1 text-sm text-slate-800">
          {recipe.steps.map((step, index) => (
            <li key={`${recipe.id}-${index}`}>{index + 1}. {step}</li>
          ))}
        </ol>
      </div>
    </article>
  );
}
