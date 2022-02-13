import { Day } from "@prisma/client";
import { db } from "~/utils/db.server";
import { handleDelete } from "./util";

export function getItemsByDay(userId: string) {
  return db.mealPlanItem.groupBy({
    by: ["day"],
    where: {
      userId,
    },
  });
}

export function getItemsForDay(userId: string, day: Day) {
  return db.mealPlanItem.findMany({
    where: {
      userId,
      day,
    },
    include: {
      recipe: true,
    },
  });
}

export function getItemsForDayDeep(userId: string, day: Day) {
  return db.mealPlanItem.findMany({
    where: {
      userId,
      day,
    },
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              recipe: true,
            },
          },
        },
      },
    },
  });
}

export function createItem(userId: string, recipeId: string, day: Day) {
  return db.mealPlanItem.create({
    data: {
      userId,
      recipeId,
      day,
    },
  });
}

export function deleteItem(id: string) {
  return handleDelete(() =>
    db.mealPlanItem.delete({
      where: {
        id,
      },
    })
  );
}
