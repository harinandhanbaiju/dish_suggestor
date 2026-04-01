"use client";

import { useMemo, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type IngredientFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  validationMessage: string;
  onlyTwoMissing: boolean;
  onOnlyTwoMissingChange: (value: boolean) => void;
  suggestions: string[];
};

function splitIngredients(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function getActiveToken(value: string): string {
  const parts = value.split(",");
  return (parts[parts.length - 1] || "").trim().toLowerCase();
}

function addSuggestionToInput(value: string, suggestion: string): string {
  const parts = value.split(",");

  if (parts.length === 0) {
    return `${suggestion}, `;
  }

  parts[parts.length - 1] = ` ${suggestion}`;
  const joined = parts.join(",").replace(/^\s+/, "");

  return `${joined}, `;
}

export function IngredientForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  validationMessage,
  onlyTwoMissing,
  onOnlyTwoMissingChange,
  suggestions,
}: IngredientFormProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedIngredients = useMemo(() => splitIngredients(value.toLowerCase()), [value]);

  const filteredSuggestions = useMemo(() => {
    const activeToken = getActiveToken(value);

    return suggestions
      .filter((item) => !selectedIngredients.includes(item.toLowerCase()))
      .filter((item) => item.toLowerCase().includes(activeToken))
      .slice(0, 8);
  }, [selectedIngredients, suggestions, value]);

  function handleSuggestionSelect(suggestion: string) {
    onChange(addSuggestionToInput(value, suggestion));
    setIsDropdownOpen(true);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/40 bg-white/75 p-5 shadow-lg backdrop-blur">
      <label htmlFor="ingredients" className="mb-2 block text-sm font-semibold text-slate-700">
        Add your ingredients (comma-separated)
      </label>
      <div className="relative">
        <input
          id="ingredients"
          name="ingredients"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsDropdownOpen(false);
            }, 140);
          }}
          placeholder="Example: tomato, onion, egg, rice"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-200 transition focus:ring-4"
        />

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
          Smart picks
        </div>

        {isDropdownOpen && filteredSuggestions.length > 0 ? (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              Ingredient Suggestions
            </div>

            <ul className="max-h-64 overflow-y-auto p-2">
              {filteredSuggestions.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSuggestionSelect(item)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <span className="capitalize">{item}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Add</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.slice(0, 6).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleSuggestionSelect(item)}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            + {item}
          </button>
        ))}
      </div>

      {validationMessage ? <p className="mt-2 text-sm font-medium text-rose-600">{validationMessage}</p> : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={onlyTwoMissing}
            onChange={(event) => onOnlyTwoMissingChange(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600"
          />
          Show only recipes with up to 2 missing ingredients
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Finding recipes...
            </>
          ) : (
            "Suggest dishes"
          )}
        </button>
      </div>
    </form>
  );
}
