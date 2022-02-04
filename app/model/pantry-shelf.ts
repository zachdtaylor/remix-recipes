import { PantryShelf, Prisma } from "@prisma/client";
import { db } from "~/utils/db.server";
import { PRISMA_ERROR_RECORD_NOT_FOUND } from "~/utils/prisma.server";

export function getPantryShelves(userId: string) {
  return db.pantryShelf.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function createPantryShelf(userId: string) {
  return db.pantryShelf.create({
    data: {
      userId,
      name: "New Shelf",
    },
  });
}

export function savePantryShelf(
  shelfId: string,
  data: Pick<PantryShelf, "name">
) {
  return db.pantryShelf.update({
    where: {
      id: shelfId,
    },
    data: {
      name: data.name,
    },
  });
}

export async function deletePantryShelf(shelfId: string) {
  try {
    const deleted = await db.pantryShelf.delete({
      where: {
        id: shelfId,
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
