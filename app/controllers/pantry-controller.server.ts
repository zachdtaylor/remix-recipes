import { json } from "remix";
import * as PantryItem from "~/model/pantry-item";
import * as PantryShelf from "~/model/pantry-shelf";
import { isEmpty } from "~/utils/misc";
import { z, ZodError } from "zod";

type ParsedFormData = { [key: string]: string };
type Errors = { [key: string]: string };

const pantryItemSchema = z.object({
  name: z.string(),
  shelfId: z.string(),
  itemId: z.string().optional(),
});

export function createPantryItem(userId: string, fd: ParsedFormData) {
  let formData;
  try {
    formData = pantryItemSchema.parse(fd);
  } catch (e) {
    if (e instanceof ZodError) {
      return json({ errors: e.flatten().fieldErrors });
    }
    return json("An unknown error occurred while parsing form data");
  }
  return PantryItem.createPantryItem(userId, formData.shelfId, {
    name: formData.name.trim(),
    id: formData.itemId === "" ? undefined : formData.itemId,
  });
}

export function deletePantryItem(formData: ParsedFormData) {
  if (!formData.itemId) {
    return json({ errors: { itemId: "Required" } });
  }
  return PantryItem.deletePantryItem(formData.itemId);
}

export function createPantryShelf(userId: string) {
  return PantryShelf.createPantryShelf(userId);
}

export function saveShelfName(formData: ParsedFormData) {
  const errors: Errors = {};
  if (!formData.shelfName) {
    errors["shelfName"] = "Required";
  }
  if (!formData.shelfId) {
    errors["shelfId"] = "Required";
  }
  return isEmpty(errors)
    ? PantryShelf.savePantryShelf(formData.shelfId, {
        name: formData.shelfName.trim(),
      })
    : json({ errors });
}

export function deleteShelf(formData: ParsedFormData) {
  if (!formData.shelfId) {
    return json({ errors: { shelfId: "Required" } });
  }
  return PantryShelf.deletePantryShelf(formData.shelfId);
}
