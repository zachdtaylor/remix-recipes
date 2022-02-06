import { Prisma, Recipe } from "@prisma/client";
import { db } from "~/utils/db.server";
import { randomImage } from "~/utils/misc";
import { PRISMA_ERROR_RECORD_NOT_FOUND } from "~/utils/prisma.server";

export function createRecipe(userId: string) {
  return db.recipe.create({
    data: {
      userId,
      name: "New Recipe",
      totalTime: "0 min",
      image: randomImage(),
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
      updatedAt: "desc",
    },
    take: 10,
  });
}

export async function deleteRecipe(id: string) {
  try {
    const deleted = await db.recipe.delete({
      where: { id: id },
    });
    return deleted;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === PRISMA_ERROR_RECORD_NOT_FOUND) {
        return null;
      }
    }
    throw e;
  }
}
