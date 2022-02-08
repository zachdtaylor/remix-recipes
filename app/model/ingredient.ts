import { Ingredient, Prisma } from "@prisma/client";
import { db } from "~/utils/db.server";
import { PRISMA_ERROR_RECORD_NOT_FOUND } from "~/utils/prisma.server";

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
    create: { recipeId, name, amount, id, ...data },
    update: data,
  });
}

export async function deleteIngredient(id: string) {
  try {
    const deleted = await db.ingredient.delete({
      where: {
        id: id,
      },
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
