import {
  LoaderFunction,
  useLoaderData,
  Form,
  ActionFunction,
  useActionData,
} from "remix";
import { DeleteButton, PrimaryButton, TextInput } from "~/components/forms";
import { PlusIcon, SaveIcon, TrashIcon } from "~/components/icons";
import { classNames } from "~/utils/misc";
import * as PantryShelf from "~/model/pantry-shelf";
import * as PantryController from "~/controllers/pantry-controller";
import { requireAuthSession } from "~/utils/auth.server";
import { parseStringFormData } from "~/utils/http";

type LoaderData = {
  pantry: Awaited<ReturnType<typeof PantryShelf.getPantryShelves>>;
};
export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  const pantry = await PantryShelf.getPantryShelves(userId);
  return { pantry };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  const formData = await parseStringFormData(request);
  if (formData._action === "create-item") {
    return PantryController.createPantryItem(userId, formData);
  }
  if (formData._action === "delete-item") {
    return PantryController.deletePantryItem(formData);
  }
  if (formData._action === "create-shelf") {
    return PantryController.createPantryShelf(userId);
  }
  if (formData._action === "save-shelf-name") {
    return PantryController.saveShelfName(formData);
  }
  if (formData._action === "delete-shelf") {
    return PantryController.deleteShelf(formData);
  }
  return null;
};

export default function Pantry() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData();
  return (
    <div>
      <Form reloadDocument method="post">
        <PrimaryButton name="_action" value="create-shelf">
          <PlusIcon /> Create Shelf
        </PrimaryButton>
      </Form>
      <div className={classNames("py-8 flex gap-8 overflow-x-auto")}>
        {data.pantry.map((shelf) => (
          <div
            key={shelf.id}
            className={classNames(
              "border-2 border-primary rounded-md p-4 h-fit",
              "w-[calc(100vw-2rem)] md:w-96 flex-none"
            )}
          >
            <Form reloadDocument method="post" className="flex">
              <TextInput
                name="shelfName"
                defaultValue={shelf.name}
                placeholder="Shelf Name"
                error={actionData?.errors?.name}
                className="text-2xl font-extrabold mb-2 w-full"
              />
              <input type="hidden" name="shelfId" value={shelf.id} />
              <button name="_action" value="save-shelf-name" className="ml-4">
                <SaveIcon />
              </button>
            </Form>
            <Form
              reloadDocument
              method="post"
              className="flex justify-between py-4"
            >
              <input type="hidden" name="shelfId" value={shelf.id} />
              <TextInput
                name="name"
                placeholder="New Item"
                error={actionData?.errors?.name}
                className="w-full"
              />
              <button name="_action" value="create-item" className="ml-4">
                <SaveIcon />
              </button>
            </Form>
            {shelf.items.map((item) => (
              <Form
                key={item.id}
                reloadDocument
                method="post"
                className="flex justify-between py-2"
              >
                <p>{item.name}</p>
                <input type="hidden" name="itemId" value={item.id} />
                <button name="_action" value="delete-item">
                  <TrashIcon />
                </button>
              </Form>
            ))}
            <Form reloadDocument method="post" className="pt-8">
              <input type="hidden" name="shelfId" value={shelf.id} />
              <DeleteButton
                name="_action"
                value="delete-shelf"
                className="w-full"
              >
                Delete Shelf
              </DeleteButton>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}
