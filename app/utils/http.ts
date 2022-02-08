import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "remix";
import invariant from "tiny-invariant";

export async function parseStringFormData(request: Request) {
  return Object.fromEntries(new URLSearchParams(await request.text()));
}

export function getStringValue(formData: FormData, name: string) {
  if (formData.has(name)) {
    const value = formData.get(name);
    invariant(
      typeof value === "string" || value === null,
      "Value must be string or null."
    );
    if (value === null) {
      return "";
    }
    return value;
  }
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
