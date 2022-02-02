import { PantryItem } from "@prisma/client";
import { db } from "~/utils/db.server";

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
  data: Pick<PantryItem, "name">
) {
  return db.pantryItem.create({
    data: {
      userId: userId,
      name: data.name,
    },
  });
}

export function deletePantryItem(id: string) {
  return db.pantryItem.delete({
    where: {
      id: id,
    },
  });
}
