import { json } from "remix";
import { z, ZodError, ZodSchema } from "zod";

export function isValidEmail(email: string) {
  if (!email.includes("@") || !email.split("@")[1].includes(".")) {
    return false;
  }
  return true;
}

export function isBlank(value: string | undefined | null) {
  if (typeof value === "string" && value.length === 0) {
    return true;
  }
  return false;
}

export function getParsed<T extends ZodSchema<any, any, any>>(
  schema: T,
  value: any
) {
  let parsed;
  try {
    parsed = schema.parse(value);
  } catch (e) {
    if (e instanceof ZodError) {
      return { errors: e.flatten().fieldErrors };
    }
    return {
      errors: "An unknown error occurred while parsing form data",
    };
  }
  type ParsedType = z.infer<T>;
  return parsed as ParsedType;
}
