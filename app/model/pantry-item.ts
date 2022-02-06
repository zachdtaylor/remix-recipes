import { PantryItem, Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { PRISMA_ERROR_RECORD_NOT_FOUND } from "~/utils/prisma.server";

export function getPantryItems(userId: string) {
  return db.pantryItem.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export function createPantryItem(
  userId: string,
  shelfId: string,
  data: Partial<PantryItem>
) {
  invariant(
    typeof data.name !== "undefined",
    "Name is required to create pantry item"
  );
  return db.pantryItem.create({
    data: {
      userId,
      shelfId,
      name: data.name,
      id: data.id,
    },
  });
}

export async function deletePantryItem(id: string) {
  try {
    const deleted = await db.pantryItem.delete({
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
