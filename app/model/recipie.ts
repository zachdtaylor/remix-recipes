import { db } from "~/utils/db";

export function createNewRecipie() {
  return db.recipie.create({
    data: {
      name: "New Recipie",
      totalTime: "0 min",
      instructions: "How do you make this recipie?",
      ingredients: {
        create: [{ amount: "a spoonful of", name: "sugar" }],
      },
    },
  });
}

export function getRecipie(id?: string) {
  return db.recipie.findUnique({
    where: { id: id },
    include: { ingredients: true },
  });
}

export function searchRecipies(query: string | null) {
  return db.recipie.findMany({
    where: {
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

export function deleteRecipie(id?: string) {
  return db.recipie.delete({
    where: { id: id },
  });
}
