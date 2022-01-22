import { User } from "@prisma/client";
import { db } from "~/utils/db";

export function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email: email,
    },
  });
}

export function createUser(data: Omit<User, "id">) {
  return db.user.create({ data: data });
}
