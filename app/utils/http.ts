import invariant from "tiny-invariant";

export async function parseFormData(request: Request) {
  const formData = await request.formData();
  const obj: { [key: string]: string | undefined } = {};
  for (const [key, value] of formData.entries()) {
    invariant(typeof value === "string", `expected string value for ${key}`);
    obj[key] = value;
  }
  return obj;
}
