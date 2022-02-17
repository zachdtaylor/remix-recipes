import { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { handleDelete } from "./util";

export function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email: email,
    },
  });
}

export function createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">) {
  return db.user.create({ data: data });
}

export function deleteUser(email: string) {
  return handleDelete(() =>
    db.user.delete({
      where: {
        email,
      },
    })
  );
}
