import { json } from "remix";
import * as PantryItem from "~/model/pantry-item";
import * as PantryShelf from "~/model/pantry-shelf";

type ParsedFormData = { [key: string]: string };
export function createPantryItem(userId: string, formData: ParsedFormData) {
  if (!formData.name) {
    return json({ errors: { name: "Required" } });
  }
  if (!formData.shelfId) {
    return json({ errors: { shelfId: "Required" } });
  }
  return PantryItem.createPantryItem(userId, formData.shelfId, {
    name: formData.name.trim(),
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
  if (!formData.shelfName) {
    return json({ errors: { shelfName: "Required" } });
  }
  if (!formData.shelfId) {
    return json({ errors: { shelfId: "Required" } });
  }
  return PantryShelf.savePantryShelf(formData.shelfId, {
    name: formData.shelfName.trim(),
  });
}

export function deleteShelf(formData: ParsedFormData) {
  if (!formData.shelfId) {
    return json({ errors: { shelfId: "Required" } });
  }
  return PantryShelf.deletePantryShelf(formData.shelfId);
}
