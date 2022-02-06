import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "remix";
import invariant from "tiny-invariant";

export async function parseStringFormData(request: Request) {
  return Object.fromEntries(new URLSearchParams(await request.text()));
}

type ReturnType<T> = T extends false
  ? string | undefined
  : T extends true
  ? string
  : never;
export function getStringValue<T extends boolean>(
  formData: FormData,
  name: string,
  strict: T = true as T
): ReturnType<T> {
  const value = formData.get(name);
  if (strict) {
    console.log(value);
    invariant(typeof value === "string", `${name} must be a string`);
  } else {
    if (typeof value !== "string") {
      return undefined as ReturnType<T>;
    }
  }
  return value as ReturnType<T>;
}

export function getStringValues(formData: FormData, name: string) {
  const values = formData.getAll(name);
  return values.map((value) => {
    invariant(
      typeof value === "string",
      `All values for ${name} must be strings`
    );
    return value;
  });
}

const uploadHandler = unstable_createFileUploadHandler({
  maxFileSize: 5_000_000,
  directory: "public/uploads",
  file: ({ filename }) => filename,
});

export async function parseRecipieFormData(request: Request) {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  return formData;
}
