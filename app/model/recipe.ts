import { Recipe } from "@prisma/client";
import { db } from "~/utils/db";

export function createRecipe(userId: string) {
  return db.recipe.create({
    data: {
      userId,
      name: "New Recipe",
      totalTime: "0 min",
      image: "",
      instructions: "How do you make this recipe?",
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
          index: "asc",
        },
      },
    },
  });
}

export function getRecipes() {
  return db.recipe.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });
}

export function searchRecipes(userId: string, query: string | null) {
  return db.recipe.findMany({
    where: {
      userId,
      name: {
        contains: query || "",
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function deleteRecipe(id: string) {
  return db.recipe.delete({
    where: { id: id },
  });
}
