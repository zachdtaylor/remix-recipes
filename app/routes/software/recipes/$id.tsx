import type {
  Ingredient as IngredientType,
  Recipe as RecipeType,
} from "@prisma/client";
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  ActionFunction,
} from "remix";

import React from "react";
import {
  useLoaderData,
  json,
  useCatch,
  redirect,
  Form,
  useFetcher,
  useTransition,
  useParams,
} from "remix";
import { v4 as uuidv4 } from "uuid";

import * as RecipeController from "~/controllers/recipe-controller.server";
import { SaveIcon, TimeIcon, TrashIcon } from "~/components/icons";
import { Heading2, ErrorSection } from "~/components/lib";
import {
  DeleteButton,
  PrimaryButton,
  TextArea,
  TextInput,
} from "~/components/forms";
import * as Recipe from "~/model/recipe";
import { getStringValue } from "~/utils/http";
import { formatDateTime, maxDate, useForm, useHydrated } from "~/utils/misc";

type LoaderData = {
  recipe: RecipeType & {
    ingredients: Array<IngredientType>;
  };
  updatedAt: string;
};
export const loader: LoaderFunction = async ({ params }) => {
  const recipe = await Recipe.getRecipe(params.id);
  if (recipe === null) {
    throw json(
      {
        message: `A recipe with id "${params.id}" does not exist.`,
      },
      {
        status: 404,
      }
    );
  }
  return {
    recipe,
    updatedAt: maxDate(
      recipe.updatedAt,
      ...recipe.ingredients.map((ingredient) => ingredient.updatedAt)
    ),
  };
};

export const action: ActionFunction = async ({ params, request }) => {
  const recipeId = params.id;
  if (typeof recipeId === "undefined") {
    return null;
  }
  const formData = await request.formData();
  const action = getStringValue(formData, "_action", true);
  if (action.includes("delete-ingredient")) {
    const [, ingredientId] = action.split(".");
    return RecipeController.deleteIngredient(ingredientId);
  }
  switch (action) {
    case "delete-recipe":
      await RecipeController.deleteRecipe(recipeId);
      return redirect("/software/recipes");
    case "add-ingredient":
      return RecipeController.addIngredient(recipeId, formData);
    case "save-recipe":
      return RecipeController.saveRecipie(recipeId, formData);
    default:
      return null;
  }
};

export default function RecipeRoute() {
  const params = useParams();
  return <RecipeRouteComponent key={params.id} />;
}

function RecipeRouteComponent() {
  const data = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const transition = useTransition();
  const hydrated = useHydrated();
  const { renderedItems, addItem } = useOptimisticItems(
    data.recipe.ingredients
  );
  const form = useForm({
    name: data.recipe.name,
    totalTime: data.recipe.totalTime,
    instructions: data.recipe.instructions,
  });

  const save = () => {
    return fetcher.submit(
      { _action: "save-recipe", ...form.values },
      { method: "post" }
    );
  };

  const isDeleting =
    transition.submission?.formData.get("_action") === "delete-recipe";

  return (
    <div>
      <Form id="recipe-form" method="post">
        <button name="_action" value="save" className="hidden" />
        <TextInput
          inputKey={data.recipe.id}
          name="name"
          placeholder="Recipie Name"
          value={form.values.name}
          onChange={(e) => form.setValue("name", e.target.value)}
          onBlur={() => form.ifChanged("name", save)}
          error={fetcher.data?.errors?.name}
          className="text-2xl font-extrabold mb-2 w-full"
        />
        <div className="flex justify-between items-center">
          <div className="flex font-light text-gray-500 items-center">
            <TimeIcon />
            <TextInput
              inputKey={data.recipe.id}
              name="totalTime"
              placeholder="Time"
              value={form.values.totalTime}
              onChange={(e) => form.setValue("totalTime", e.target.value)}
              onBlur={() => form.ifChanged("totalTime", save)}
              error={fetcher.data?.errors?.totalTime}
              className="ml-1"
            />
          </div>
        </div>
      </Form>
      <hr className="my-4" />
      <div className="flex items-center mb-2">
        <Heading2 className="mr-2">Ingredients</Heading2>
      </div>
      <div className="mb-4 w-full table">
        <div className="table-row">
          <div className="text-left w-1/3 pr-4 font-bold table-cell">
            Amount
          </div>
          <div className="text-left table-cell font-bold">Name</div>
          <div className="w-4 table-cell"></div>
        </div>
        {renderedItems.map((ingredient) => (
          <IngredientRow key={ingredient.id} ingredient={ingredient} />
        ))}
        <IngredientRow
          isNew
          ingredient={{ id: uuidv4(), name: "", amount: "" }}
          onSave={addItem}
        />
      </div>
      <Heading2 className="mb-2">Instructions</Heading2>
      <TextArea
        key={data.recipe.id}
        form="recipe-form"
        name="instructions"
        placeholder="Instructions"
        value={form.values.instructions}
        onChange={(e) => form.setValue("instructions", e.target.value)}
        onBlur={() => form.ifChanged("instructions", save)}
        error={fetcher.data?.errors?.instructions}
      />
      <hr className="my-4" />
      <div className="flex justify-between">
        {hydrated ? (
          `Autosaved at ${formatDateTime(data.updatedAt)}`
        ) : (
          <PrimaryButton name="_action" value="save-recipe" form="recipe-form">
            Save
          </PrimaryButton>
        )}
        <DeleteButton
          name="_action"
          value="delete-recipe"
          form="recipe-form"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting" : "Delete this Recipe"}
        </DeleteButton>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <ErrorSection title={caught.statusText} message={caught.data.message} />
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorSection
      title="An unexpected error occurred"
      message={error.message}
    />
  );
};

type TIngredient = Pick<IngredientType, "id" | "amount" | "name">;
type IngredientRowProps = {
  ingredient: TIngredient;
  isNew?: boolean;
  onSave?: (ingredient: TIngredient) => void;
};
function IngredientRow({ ingredient, isNew, onSave }: IngredientRowProps) {
  const form = useForm(ingredient);
  const fetcher = useFetcher();
  const amountRef = React.useRef<HTMLInputElement>(null);

  const save = () => {
    fetcher.submit(
      {
        _action: "save-recipe",
        ingredientName: form.values.name,
        ingredientAmount: form.values.amount,
        ingredientId: ingredient.id,
      },
      { method: "post" }
    );
    onSave?.({
      id: ingredient.id,
      name: form.values.name,
      amount: form.values.amount,
    });
    isNew && form.reset();
    isNew && amountRef.current?.focus();
  };

  const deleteIngredient = () => {
    return fetcher.submit(
      { _action: `delete-ingredient.${ingredient.id}` },
      { method: "post" }
    );
  };

  const isDeleting =
    fetcher.submission?.formData.get("_action") ===
    `delete-ingredient.${ingredient.id}`;

  return isDeleting ? null : (
    <div className="table-row">
      <div className="pr-4 py-1 table-cell">
        <input
          type="hidden"
          name="ingredientId"
          form="recipe-form"
          value={ingredient.id}
        />
        <TextInput
          name="ingredientAmount"
          inputRef={amountRef}
          value={form.values.amount}
          onChange={(e) => form.setValue("amount", e.target.value)}
          form="recipe-form"
          placeholder="---"
          onBlur={() => !isNew && form.ifChanged("amount", save)}
          onEnter={(e) => {
            e.preventDefault();
            save();
          }}
          className="w-full"
        />
      </div>
      <div className="pr-4 py-1 table-cell">
        <TextInput
          name="ingredientName"
          placeholder="---"
          value={form.values.name}
          onChange={(e) => form.setValue("name", e.target.value)}
          form="recipe-form"
          onBlur={() => form.ifChanged("name", save)}
          onEnter={(e) => {
            e.preventDefault();
            save();
          }}
          className="w-full"
        />
      </div>
      <div className="text-right py-1 table-cell">
        <button
          form="recipe-form"
          name="_action"
          value={
            isNew ? "add-ingredient" : `delete-ingredient.${ingredient.id}`
          }
          onClick={deleteIngredient}
        >
          {isNew ? <SaveIcon /> : <TrashIcon />}
        </button>
      </div>
    </div>
  );
}

export function useOptimisticItems(items: Array<TIngredient>) {
  const [optimisticItems, setOptimisticItems] = React.useState<
    Array<TIngredient>
  >([]);

  const renderedItems: Array<TIngredient> = [...items];
  const savedIds = new Set(items.map((item) => item.id));
  for (let item of optimisticItems) {
    if (!savedIds.has(item.id)) {
      renderedItems.push(item);
    }
  }

  const optimisticIds = new Set(optimisticItems.map((item) => item.id));
  let intersection = new Set([...savedIds].filter((x) => optimisticIds.has(x)));
  if (intersection.size) {
    setOptimisticItems(
      optimisticItems.filter((item) => !intersection.has(item.id))
    );
  }

  const addItem = (item: TIngredient) => {
    setOptimisticItems((items) => [...items, item]);
  };

  return { renderedItems, addItem };
}
