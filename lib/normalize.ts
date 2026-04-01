export function normalizeIngredient(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeIngredientList(values: string[]): string[] {
  const normalized = values
    .map(normalizeIngredient)
    .filter((item) => item.length > 0);

  return Array.from(new Set(normalized));
}
