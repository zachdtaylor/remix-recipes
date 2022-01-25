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
  const name = data.name;
  const amount = data.amount;
  return db.ingredient.update({
    where: {
      id: id,
    },
    data: { name, amount },
  });
}

export function createOrUpdateIngredient(
  recipeId: string,
  id: string | undefined,
  data: Partial<Ingredient>
) {
  const name = data.name || "";
  const amount = data.amount || "";
  return db.ingredient.upsert({
    where: {
      id: id,
    },
    create: { recipeId, name, amount, ...data },
    update: data,
  });
}

export function deleteIngredient(id: string) {
  return db.ingredient.delete({
    where: {
      id: id,
    },
  });
}
