# Dish Suggestion Helper

Dish Suggestion Helper is a full-stack Next.js app that recommends dishes based on ingredients a user already has.

## Tech Stack

- Next.js 16 with App Router
- React 19
- Next.js API Routes
- MongoDB + Mongoose
- Tailwind CSS
- Ready for deployment on Vercel

## Core Features

- Ingredient input as comma-separated text
- Suggestion API at /api/suggest (POST)
- Match score calculation:
	- match_score = matched_ingredients / total_recipe_ingredients
- Sorted recommendations (highest match first)
- Result cards with:
	- dish name
	- match score
	- required ingredients
	- missing ingredients highlighted in red
	- cooking steps
- Best Match badge for top result
- Missing ingredient count message
- Client-side loading spinner
- Empty input validation
- Optional filter: recipes with up to 2 missing ingredients
- Local favorites (saved in localStorage)

## Project Structure

- app/page.tsx: Main UI
- app/api/suggest/route.ts: Suggestion API logic
- lib/db.ts: MongoDB connection helper
- lib/normalize.ts: Ingredient normalization utility
- lib/seedRecipes.ts: Starter recipe seeding
- models/Recipe.ts: Mongoose Recipe model
- components/: Reusable UI components
- types/recipe.ts: Shared TypeScript types

## Environment Variables

Copy .env.example into .env.local and set values:

MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=dish_suggestion_helper

## Local Development

Install dependencies:

npm install

Run development server:

npm run dev

Open http://localhost:3000

## API Contract

POST /api/suggest

Request body:

{
	"ingredients": ["tomato", "onion", "egg"]
}

Response body:

{
	"recipes": [
		{
			"id": "...",
			"name": "Vegetable Omelette",
			"ingredients": ["eggs", "onion", "bell pepper", "salt", "black pepper", "butter"],
			"steps": ["..."],
			"matchedIngredients": ["onion"],
			"missingIngredients": ["eggs", "bell pepper", "salt", "black pepper", "butter"],
			"matchScore": 0.17
		}
	]
}

## Deploy to Vercel

1. Push this project to a Git repository.
2. Import the repo in Vercel.
3. Configure environment variables in Vercel project settings:
	 - MONGODB_URI
	 - MONGODB_DB_NAME
4. Deploy.

The project uses standard Next.js conventions and is Vercel-compatible out of the box.
