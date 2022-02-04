import * as Recipe from "~/model/recipe";
import * as Ingredient from "~/model/ingredient";
import invariant from "tiny-invariant";
import { isBlank } from "~/utils/validation";

export function saveRecipie(
  recipeId: string,
  formData: { [key: string]: string | undefined }
) {
  const recipiePromise = Recipe.updateRecipe(recipeId, {
    name: formData.name,
    totalTime: formData.totalTime,
    instructions: formData.instructions,
    image: formData.image,
  });
  const ingredientPromises = Object.keys(formData)
    .filter((key) => {
      const [inputType, id, _] = key.split(".");
      return inputType === "ingredient" && id !== "";
    })
    .map((key) => {
      const [_, id, name] = key.split(".");
      invariant(
        name === "amount" || name === "name",
        `invalid form input name ${key}`
      );
      return Ingredient.createOrUpdateIngredient(recipeId, id, {
        [name]: formData[key],
      });
    });
  return Promise.all([recipiePromise, ...ingredientPromises]);
}

export function validateRecipe(recipeData: {
  [key: string]: string | undefined;
}) {
  const errors: { [key: string]: string } = {};
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
