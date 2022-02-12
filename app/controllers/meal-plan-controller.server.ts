import { Day } from "@prisma/client";
import { json } from "remix";
import { z } from "zod";
import * as Recipe from "~/model/recipe";
import * as MealPlanItem from "~/model/meal-plan-item";
import { getParsed } from "~/utils/validation";

export async function searchRecipes(
  userId: string,
  q: string | null,
  day?: string
) {
  const [recipes, dayPlan] = await Promise.all([
    Recipe.searchRecipes(userId, q),
    getDayPlan(userId, day),
  ]);
  return recipes.filter(
    (recipe) =>
      typeof dayPlan.find((item) => item.recipe.id === recipe.id) ===
      "undefined"
  );
}

export async function getDayPlan(userId: string, day?: string) {
  if (typeof day === "undefined" || day === "") {
    return [];
  }
  return MealPlanItem.getItemsForDay(userId, day as Day);
}

const addRecipeToMealPlanSchema = z.object({
  userId: z.string(),
  recipeId: z.string(),
  day: z.enum([
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]),
});

export async function addRecipeToMealPlan(
  userId: string,
  recipeId: FormDataEntryValue | null,
  day?: string
) {
  const parsed = getParsed(addRecipeToMealPlanSchema, {
    userId,
    day,
    recipeId,
  });
  if ("errors" in parsed) {
    return json(parsed);
  }
  return MealPlanItem.createItem(parsed.userId, parsed.recipeId, parsed.day);
}

const removeRecipeFromMealPlanSchema = z.object({
  planItemId: z.string(),
});

export async function removeRecipeFromMealPlan(
  planItemId: FormDataEntryValue | null
) {
  const parsed = getParsed(removeRecipeFromMealPlanSchema, { planItemId });
  if ("errors" in parsed) {
    return json(parsed);
  }
  return MealPlanItem.deleteItem(parsed.planItemId);
}
