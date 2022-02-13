import {
  Day,
  Ingredient as TIngredient,
  Recipe as TRecipe,
} from "@prisma/client";
import { json } from "remix";
import { z } from "zod";
import * as Recipe from "~/model/recipe";
import * as MealPlanItem from "~/model/meal-plan-item";
import * as PantryItem from "~/model/pantry-item";
import * as PantryShelf from "~/model/pantry-shelf";
import { getParsed } from "~/utils/validation";
import { daysOfTheWeek } from "~/utils/misc";

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

async function getDayPlanDeep(userId: string, day?: string) {
  if (typeof day === "undefined" || day === "") {
    return [];
  }
  return MealPlanItem.getItemsForDayDeep(userId, day as Day);
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

type ShoppingListItem = TIngredient & {
  recipe: TRecipe;
  day: Day;
};

export async function getShoppingList(userId: string) {
  const weekMeals = await Promise.all(
    daysOfTheWeek().map((day) => getDayPlanDeep(userId, day.toLowerCase()))
  );
  const weekIngredients = weekMeals.reduce((arr, dayMeals) => {
    const dayIngredients = dayMeals.reduce(
      (dayArr, meal) => [
        ...dayArr,
        ...attachDay(meal.recipe.ingredients, meal.day),
      ],
      [] as Array<ShoppingListItem>
    );
    return [...arr, ...dayIngredients];
  }, [] as Array<ShoppingListItem>);

  const pantryItems = await PantryItem.getPantryItems(userId);

  const found = weekIngredients.filter(
    (ingredient) =>
      !pantryItems.find((pantryItem) =>
        isMatch(pantryItem.name, ingredient.name)
      )
  );

  return dedupe(found);
}

function attachDay(
  shoppingList: Array<Omit<ShoppingListItem, "day">>,
  day: Day
) {
  return shoppingList.map((item) => ({ ...item, day }));
}

function isMatch(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

type MapType = {
  amount: string;
  recipe: ShoppingListItem["recipe"];
  day: Day;
};
function dedupe(shoppingList: Array<ShoppingListItem>) {
  const map = new Map<string, Array<MapType>>();
  shoppingList.forEach((item) => {
    const name = item.name.toLowerCase();
    const existing = map.get(name) || [];
    map.set(name, [
      ...existing,
      { amount: item.amount, recipe: item.recipe, day: item.day },
    ]);
  });
  return Array.from(map).map(([name, through]) => ({
    name,
    through,
  }));
}

const addItemToPantrySchema = z.object({
  name: z.string(),
});

const weeklyShelfName = "Weekly Shopping List";
export async function addItemToPantry(
  userId: string,
  name: FormDataEntryValue | null
) {
  const parsed = getParsed(addItemToPantrySchema, { name });
  if ("errors" in parsed) {
    return json(parsed);
  }
  let mealPlanShelf = await PantryShelf.getPantryShelf(weeklyShelfName);
  if (mealPlanShelf == null) {
    mealPlanShelf = await PantryShelf.createPantryShelf(
      userId,
      weeklyShelfName
    );
  }
  return PantryItem.createPantryItem(userId, mealPlanShelf.id, {
    name: parsed.name,
  });
}
