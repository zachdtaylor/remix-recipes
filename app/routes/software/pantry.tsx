import React from "react";
import {
  LoaderFunction,
  useLoaderData,
  Form,
  ActionFunction,
  useTransition,
  useFetcher,
} from "remix";
import { v4 as uuidv4 } from "uuid";
import { DeleteButton, PrimaryButton, TextInput } from "~/components/forms";
import { PlusIcon, SaveIcon, TrashIcon } from "~/components/icons";
import { classNames, useHydrated } from "~/utils/misc";
import * as PantryShelf from "~/model/pantry-shelf";
import * as PantryController from "~/controllers/pantry-controller.server";
import { requireAuthSession } from "~/utils/auth.server";
import { parseStringFormData } from "~/utils/http";
import { useOptimisticItems } from "~/utils/misc";

type TPantryShelves = Awaited<ReturnType<typeof PantryShelf.getPantryShelves>>;
type TPantryShelf = TPantryShelves[number];
type TPantryShelfItem = TPantryShelf["items"][number];
type PickedItem = Pick<TPantryShelfItem, "id" | "name">;
type LoaderData = {
  pantry: TPantryShelves;
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
  switch (formData._action) {
    case "create-item":
      return PantryController.createPantryItem(userId, formData);
    case "delete-item":
      return PantryController.deletePantryItem(formData);
    case "create-shelf":
      return PantryController.createPantryShelf(userId);
    case "save-shelf-name":
      return PantryController.saveShelfName(formData);
    case "delete-shelf":
      return PantryController.deleteShelf(formData);
    default:
      return null;
  }
};

export default function Pantry() {
  const data = useLoaderData<LoaderData>();
  const transition = useTransition();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isCreatingShelf =
    transition.submission?.formData.get("_action") === "create-shelf";

  React.useEffect(() => {
    if (isCreatingShelf) {
      if (containerRef.current) {
        containerRef.current.scrollLeft = 0;
      }
    }
  }, [isCreatingShelf]);

  return (
    <div className="py-8">
      <Form method="post">
        <PrimaryButton
          name="_action"
          value="create-shelf"
          disabled={isCreatingShelf}
        >
          <PlusIcon /> {isCreatingShelf ? "Creating Shelf" : "Create Shelf"}
        </PrimaryButton>
      </Form>
      <div
        ref={containerRef}
        className={classNames(
          "py-8 flex gap-8 overflow-x-auto snap-mandatory md:snap-none",
          isCreatingShelf ? "snap-none" : "snap-x"
        )}
      >
        {data.pantry.map((shelf) => (
          <Shelf key={shelf.id} shelf={shelf} />
        ))}
      </div>
    </div>
  );
}

function Shelf({ shelf }: { shelf: TPantryShelf }) {
  const fetcher = useFetcher();
  const hydrated = useHydrated();
  const createItemRef = React.useRef<HTMLFormElement>(null);
  const createItemInputRef = React.useRef<HTMLInputElement>(null);
  const { renderedItems, addItem } = useOptimisticItems<PickedItem>(
    shelf.items,
    (a, b) => (a.name > b.name ? 1 : -1)
  );

  const isDeletingShelf =
    fetcher.submission?.formData.get("_action") === "delete-shelf" &&
    fetcher.submission.formData.get("shelfId") === shelf.id;

  return isDeletingShelf ? null : (
    <fieldset
      key={shelf.id}
      className={classNames(
        "border-2 border-primary rounded-md p-4 h-fit",
        "w-[calc(100vw-2rem)] md:w-96 flex-none snap-center"
      )}
    >
      <fetcher.Form method="post" className="flex">
        <label hidden htmlFor={`shelfName.${shelf.id}`}>
          Shelf Name
        </label>
        <TextInput
          id={`shelfName.${shelf.id}`}
          name="shelfName"
          defaultValue={shelf.name}
          placeholder="Shelf Name"
          error={fetcher.data?.errors?.shelfName}
          className="text-2xl font-extrabold mb-2 w-full"
          onBlur={(e) =>
            e.target.value !== shelf.name &&
            fetcher.submit(
              {
                _action: "save-shelf-name",
                shelfName: e.target.value,
                shelfId: shelf.id,
              },
              { method: "post" }
            )
          }
        />
        <input type="hidden" name="shelfId" value={shelf.id} />
        {hydrated ? null : (
          <button name="_action" value="save-shelf-name" className="ml-4">
            <SaveIcon />
          </button>
        )}
      </fetcher.Form>
      <Form
        method="post"
        ref={createItemRef}
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as HTMLFormElement;
          const itemNameInput = target.elements.namedItem(
            "name"
          ) as HTMLInputElement;
          const id = uuidv4();
          fetcher.submit(
            {
              itemId: id,
              name: itemNameInput.value,
              shelfId: shelf.id,
              _action: "create-item",
            },
            { method: "post" }
          );
          addItem({ id, name: itemNameInput.value });
          createItemRef.current?.reset();
        }}
      >
        <fieldset className="flex justify-between py-4">
          <input type="hidden" name="shelfId" value={shelf.id} />
          <label hidden htmlFor={`newItem.${shelf.id}`}>
            New Item
          </label>
          <TextInput
            id={`newItem.${shelf.id}`}
            name="name"
            placeholder="New Item"
            error={fetcher.data?.errors?.name}
            inputRef={createItemInputRef}
            className="w-full"
          />
          <button name="_action" value="create-item" className="ml-4">
            <SaveIcon />
          </button>
        </fieldset>
      </Form>
      {renderedItems.map((item) => (
        <ShelfItem key={item.id} item={item} />
      ))}
      <fetcher.Form method="post" className="pt-8">
        <input type="hidden" name="shelfId" value={shelf.id} />
        <DeleteButton name="_action" value="delete-shelf" className="w-full">
          Delete Shelf
        </DeleteButton>
      </fetcher.Form>
    </fieldset>
  );
}

function ShelfItem({ item }: { item: PickedItem }) {
  const fetcher = useFetcher();

  const isDeletingItem =
    fetcher.submission?.formData.get("_action") === "delete-item";

  return isDeletingItem ? null : (
    <fetcher.Form method="post" className="flex justify-between py-2 group">
      <p>{item.name}</p>
      <input type="hidden" name="itemId" value={item.id} />
      <label hidden htmlFor={`delete-${item.id}`}>
        Delete {item.name}
      </label>
      <button
        id={`delete-${item.id}`}
        name="_action"
        value="delete-item"
        className="opacity-0 focus:opacity-100 group-hover:opacity-100 transition-opacity"
      >
        <TrashIcon />
      </button>
    </fetcher.Form>
  );
}
