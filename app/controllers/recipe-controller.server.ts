import * as Recipe from "~/model/recipe";
import * as Ingredient from "~/model/ingredient";
import invariant from "tiny-invariant";
import { isBlank } from "~/utils/validation";
import { json } from "remix";
import { getStringValue, getStringValues } from "~/utils/http";

type ParsedFormData = { [key: string]: string };
type Errors = { [key: string]: string };
export async function saveRecipie(recipeId: string, formData: FormData) {
  const ingredientIds = getStringValues(formData, "ingredientId");
  const ingredientAmounts = getStringValues(formData, "ingredientAmount");
  const ingredientNames = getStringValues(formData, "ingredientName");
  invariant(
    ingredientIds.length === ingredientAmounts.length &&
      ingredientAmounts.length === ingredientNames.length,
    "Ingredient arrays must have the same length"
  );
  const recipiePromise = Recipe.updateRecipe(recipeId, {
    name: getStringValue(formData, "name", false),
    totalTime: getStringValue(formData, "totalTime", false),
    instructions: getStringValue(formData, "instructions", false),
  });
  const ingredientPromises = ingredientIds.map((id, index) => {
    const amount = ingredientAmounts[index];
    const name = ingredientNames[index];
    return Ingredient.createOrUpdateIngredient(recipeId, id, {
      amount,
      name,
    });
  });
  await Promise.all([recipiePromise, ...ingredientPromises]);
  return "ok";
}

export function validateRecipe(recipeData: {
  [key: string]: string | undefined;
}) {
  const errors: Errors = {};
  if (isBlank(recipeData.name)) {
    errors.name = "Name cannot be blank";
  }
  if (isBlank(recipeData.totalTime)) {
    errors.totalTime = "Time cannot be blank";
  }
  if (isBlank(recipeData.instructions)) {
    errors.instructions = "Instructions cannot be blank";
  }
  return errors;
}

export function deleteRecipe(recipeId: string) {
  if (!recipeId) {
    return json({ errors: { recipeId: "Required" } });
  }
  return Recipe.deleteRecipe(recipeId);
}

export function addIngredient(recipeId: string, formData: FormData) {
  const errors: Errors = {};
  if (!recipeId) {
    errors["recipeId"] = "Required";
  }
  if (!formData.get("name")) {
    errors["name"] = "Required";
  }
  return Ingredient.createOrUpdateIngredient(
    recipeId,
    getStringValue(formData, "id"),
    {
      name: getStringValue(formData, "name"),
      amount: getStringValue(formData, "amount"),
    }
  );
}

export function deleteIngredient(ingredientId: string) {
  return Ingredient.deleteIngredient(ingredientId);
}
