import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "remix";
import invariant from "tiny-invariant";

export async function parseStringFormData(request: Request) {
  return Object.fromEntries(new URLSearchParams(await request.text()));
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
