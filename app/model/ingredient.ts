import { Ingredient } from "@prisma/client";
import { db } from "~/utils/db";

export function createIngredient(recipieId: string) {
  return db.ingredient.create({
    data: {
      recipeId: recipieId,
      name: "",
      amount: "",
    },
  });
}

export function updateIngredient(id: string, data: Partial<Ingredient>) {
  return db.ingredient.update({
    where: {
      id: id,
    },
    data,
  });
}

export function deleteIngredient(id: string) {
  return db.ingredient.delete({
    where: {
      id: id,
    },
  });
}
