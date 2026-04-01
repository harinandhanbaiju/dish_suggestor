import { Schema, model, models } from "mongoose";

export type RecipeDocument = {
  name: string;
  ingredients: string[];
  steps: string[];
};

const recipeSchema = new Schema<RecipeDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: true,
      default: [],
    },
    steps: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = models.Recipe || model<RecipeDocument>("Recipe", recipeSchema);
