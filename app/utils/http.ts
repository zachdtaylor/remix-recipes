import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "remix";
import invariant from "tiny-invariant";

export async function parseStringFormData(formData: FormData) {
  const obj: { [key: string]: string | undefined } = {};
  for (const [key, value] of formData.entries()) {
    invariant(typeof value === "string", `expected string value for ${key}`);
    obj[key] = value;
  }
  return obj;
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
  return parseStringFormData(formData);
}
