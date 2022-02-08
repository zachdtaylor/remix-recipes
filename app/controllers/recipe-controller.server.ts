import * as Recipe from "~/model/recipe";
import * as Ingredient from "~/model/ingredient";
import invariant from "tiny-invariant";
import { json } from "remix";
import { getStringValue, getStringValues } from "~/utils/http";
import { isEmpty } from "~/utils/misc";

type Errors = { [key: string]: string };

export async function saveRecipie(recipeId: string, formData: FormData) {
  // Step 1: parse data out of form
  const name = getStringValue(formData, "name");
  const totalTime = getStringValue(formData, "totalTime");
  const instructions = getStringValue(formData, "instructions");
  const ingredientIds = getStringValues(formData, "ingredientId");
  const ingredientAmounts = getStringValues(formData, "ingredientAmount");
  const ingredientNames = getStringValues(formData, "ingredientName");
  invariant(
    ingredientIds.length === ingredientAmounts.length &&
      ingredientAmounts.length === ingredientNames.length,
    "Ingredient arrays must have the same length"
  );

  // Step 2: validate
  const errors = validateRecipe({
    name,
    totalTime,
    instructions,
    ingredientIds,
    ingredientAmounts,
    ingredientNames,
  });

  if (!isEmpty(errors)) {
    return json({ errors });
  }

  // Step 3: save
  const recipiePromise = Recipe.updateRecipe(recipeId, {
    name,
    totalTime,
    instructions,
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

type RecipeData = {
  name?: string;
  totalTime?: string;
  instructions?: string;
  ingredientIds: Array<string>;
  ingredientAmounts: Array<string>;
  ingredientNames: Array<string>;
};
export function validateRecipe({
  name,
  totalTime,
  instructions,
  ingredientIds,
  ingredientAmounts,
  ingredientNames,
}: RecipeData) {
  const errors: Errors = {};
  if (name === "") {
    errors.name = "Required";
  }
  if (totalTime === "") {
    errors.totalTime = "Required";
  }
  if (instructions === "") {
    errors.instructions = "Required";
  }
  ingredientIds.forEach((id, index) => {
    const ingredient = {
      id,
      amount: ingredientAmounts[index],
      name: ingredientNames[index],
    };
    if (ingredient.name === "") {
      errors[`ingredient.${id}.name`] = "Required";
    }
  });
  return errors;
}

export function deleteRecipe(recipeId: string) {
  if (!recipeId) {
    return json({ errors: { recipeId: "Required" } });
  }
  return Recipe.deleteRecipe(recipeId);
}

export function deleteIngredient(ingredientId: string) {
  return Ingredient.deleteIngredient(ingredientId);
}
