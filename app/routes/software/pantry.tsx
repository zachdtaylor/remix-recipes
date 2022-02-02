import {
  LoaderFunction,
  useLoaderData,
  Form,
  ActionFunction,
  json,
} from "remix";
import { TextInput } from "~/components/forms";
import { SaveIcon, TrashIcon } from "~/components/icons";
import { classNames } from "~/utils/misc";
import * as PantryItem from "~/model/pantry-item";
import { requireAuthSession } from "~/utils/auth.server";
import { PantryItem as PantryItemType } from "@prisma/client";
import { parseStringFormData } from "~/utils/http";

type LoaderData = {
  pantry: Array<PantryItemType>;
};
export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  const pantry = await PantryItem.getPantryItems(userId);
  return { pantry };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  const formData = await parseStringFormData(request);
  if (formData._action === "create") {
    if (typeof formData.name === "undefined") {
      return json({ errors: { name: "Required" } });
    }
    return PantryItem.createPantryItem(userId, { name: formData.name });
  }
  if (formData._action.startsWith("delete")) {
    const [_, id] = formData._action.split(".");
    return PantryItem.deletePantryItem(id);
  }
  return null;
};

export default function Pantry() {
  const data = useLoaderData<LoaderData>();
  return (
    <div
      className={classNames(
        "grid gap-y-4 grid-cols-1",
        "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}
    >
      {data.pantry.map((item) => (
        <Form
          key={item.id}
          reloadDocument
          method="post"
          className="flex justify-between border-2 border-primary p-4"
        >
          <p>{item.name}</p>
          <button name="_action" value={`delete.${item.id}`}>
            <TrashIcon />
          </button>
        </Form>
      ))}
      <Form
        reloadDocument
        method="post"
        className="flex justify-between border-2 border-primary p-4"
      >
        <TextInput name="name" placeholder="Item" />
        <button name="_action" value="create">
          <SaveIcon />
        </button>
      </Form>
    </div>
  );
}
