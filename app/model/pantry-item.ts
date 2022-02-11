import { PantryItem } from "@prisma/client";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { handleDelete } from "./util";

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
  return handleDelete(() =>
    db.pantryItem.delete({
      where: {
        id: id,
      },
    })
  );
}
