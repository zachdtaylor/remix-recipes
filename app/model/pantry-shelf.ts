import { PantryShelf } from "@prisma/client";
import { db } from "~/utils/db.server";

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
      createdAt: "asc",
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

export function deletePantryShelf(shelfId: string) {
  return db.pantryShelf.delete({
    where: {
      id: shelfId,
    },
  });
}
