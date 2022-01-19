import { Recipe } from "@prisma/client";
import { db } from "~/utils/db";

export function createRecipe() {
  return db.recipe.create({
    data: {
      name: "New Recipe",
      totalTime: "0 min",
      instructions: "How do you make this recipe?",
      ingredients: {
        create: [{ amount: "a spoonful", name: "sugar" }],
      },
    },
  });
}

export function updateRecipe(id: string, data: Partial<Recipe>) {
  return db.recipe.update({
    where: {
      id: id,
    },
    data,
  });
}

export function getRecipe(id?: string) {
  return db.recipe.findUnique({
    where: { id: id },
    include: {
      ingredients: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export function searchRecipes(query: string | null) {
  return db.recipe.findMany({
    where: {
      name: {
        contains: query || "",
        mode: "insensitive",
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export function deleteRecipe(id: string) {
  return db.recipe.delete({
    where: { id: id },
  });
}
