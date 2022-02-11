import { Prisma } from "@prisma/client";
import { PRISMA_ERROR_RECORD_NOT_FOUND } from "~/utils/prisma.server";

export async function handleDelete<T>(deleteObject: () => T) {
  try {
    const deleted = await deleteObject();
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
