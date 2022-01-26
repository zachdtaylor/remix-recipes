import type {
  Ingredient as IngredientType,
  Recipe as RecipeType,
} from "@prisma/client";
import { LoaderFunction, ActionFunction, useParams } from "remix";

import React from "react";
import {
  useLoaderData,
  json,
  useCatch,
  ErrorBoundaryComponent,
  redirect,
  Form,
  useFetcher,
  useTransition,
} from "remix";

import * as RecipeController from "~/controllers/recipe-controller";
import { TextArea, TextInput } from "~/components/forms";
import { Heading2 } from "~/components/heading";
import {
  SaveIcon,
  ThreeDotsIcon,
  TimeIcon,
  TrashIcon,
} from "~/components/icons";
import { DeleteButton, ErrorSection, PrimaryButton } from "~/components/lib";
import * as Recipe from "~/model/recipe";
import * as Ingredient from "~/model/ingredient";
import { parseRecipieFormData, parseStringFormData } from "~/utils/http";
import {
  formatDateTime,
  isEmpty,
  maxDate,
  useFocusOnce,
  useForm,
  useMounted,
} from "~/utils/misc";

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
  const formData = await parseStringFormData(request);
  const errors = RecipeController.validateRecipe(formData);
  if (!isEmpty(errors)) {
    return { id: recipeId, errors };
  }
  if (formData._action === "delete") {
    await Recipe.deleteRecipe(recipeId);
    return redirect("/software/recipes");
  }
  if (formData._action === "add-ingredient") {
    return Ingredient.createOrUpdateIngredient(recipeId, formData.id, {
      name: formData.name,
      amount: formData.amount,
    });
  }
  if (formData._action?.includes("delete-ingredient")) {
    const ingredientId = formData._action.split(".")[1];
    return Ingredient.deleteIngredient(ingredientId);
  }
  return RecipeController.saveRecipie(recipeId, formData);
};

export default function RecipeRoute() {
  const params = useParams();
  return <RecipeRouteComponent key={params.id} />;
}

function RecipeRouteComponent() {
  const data = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const form = useForm({
    name: data.recipe.name,
    totalTime: data.recipe.totalTime,
    instructions: data.recipe.instructions,
  });
  const transition = useTransition();
  const mounted = useMounted();
  const [hasCreated, setHasCreated] = React.useState(false);
  const [newRows, setNewRows] = React.useState(1);
  const [deletedIds, setDeletedIds] = React.useState<Array<string>>([]);

  const save = () => {
    return fetcher.submit(
      { _action: "save", ...form.values },
      { method: "post" }
    );
  };

  const isDeleting =
    transition.submission?.formData.get("_action") === "delete";

  return (
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
      <hr className="my-4" />
      <div className="flex items-center mb-2">
        <Heading2 className="mr-2">Ingredients</Heading2>
      </div>
      <table className="mb-4 w-full">
        <thead>
          <tr>
            <th className="text-left w-1/3 pr-4">Amount</th>
            <th className="text-left">Name</th>
            <th className="w-4"></th>
          </tr>
        </thead>
        <tbody>
          {data.recipe.ingredients.map((ingredient, index) =>
            !!deletedIds.find((id) => id === ingredient.id) ? null : (
              <IngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                onDelete={() => {
                  setDeletedIds((ids) => [...ids, ingredient.id]);
                }}
              />
            )
          )}
          {Array.from(Array(newRows)).map((_, index) => (
            <NewIngredientRow
              key={index}
              ingredient={{
                id: "",
                name: "",
                amount: "",
              }}
              focusWhen={hasCreated}
              onCreate={() => {
                setHasCreated(true);
                setNewRows((n) => n + 1);
              }}
            />
          ))}
        </tbody>
      </table>
      <Heading2 className="mb-2">Instructions</Heading2>
      <TextArea
        key={data.recipe.id}
        name="instructions"
        placeholder="Instructions"
        value={form.values.instructions}
        onChange={(e) => form.setValue("instructions", e.target.value)}
        onBlur={() => form.ifChanged("instructions", save)}
        error={fetcher.data?.errors?.instructions}
      />
      <hr className="my-4" />
      <div className="flex justify-between">
        {mounted ? (
          `Autosaved at ${formatDateTime(data.updatedAt)}`
        ) : (
          <PrimaryButton name="_action" value="save">
            Save
          </PrimaryButton>
        )}
        <DeleteButton name="_action" value="delete" disabled={isDeleting}>
          {isDeleting ? "Deleting" : "Delete this Recipe"}
        </DeleteButton>
      </div>
    </Form>
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

type IngredientRowProps = {
  ingredient: IngredientType;
  onDelete?: () => void;
};
function IngredientRow({ ingredient, onDelete }: IngredientRowProps) {
  const form = useForm(ingredient);
  const fetcher = useFetcher();

  const save = () => {
    const name = `ingredient.${ingredient.id}.name`;
    const amount = `ingredient.${ingredient.id}.amount`;
    fetcher.submit(
      {
        _action: "save",
        [name]: form.values.name,
        [amount]: form.values.amount,
      },
      { method: "post" }
    );
  };

  const deleteIngredient = () => {
    onDelete?.();
    return fetcher.submit(
      { _action: `delete-ingredient.${ingredient.id}` },
      { method: "post" }
    );
  };

  return (
    <tr key={ingredient.id}>
      <td className="pr-4 py-1">
        <TextInput
          name={`ingredient.${ingredient.id}.amount`}
          value={form.values.amount}
          onChange={(e) => form.setValue("amount", e.target.value)}
          placeholder="---"
          onBlur={() => form.ifChanged("amount", save)}
          onEnter={(e) => {
            e.preventDefault();
            save();
          }}
          className="w-full"
        />
      </td>
      <td className="pr-4 py-1">
        <TextInput
          name={`ingredient.${ingredient.id}.name`}
          placeholder="---"
          value={form.values.name}
          onChange={(e) => form.setValue("name", e.target.value)}
          onBlur={() => form.ifChanged("name", save)}
          onEnter={(e) => {
            e.preventDefault();
            save();
          }}
          className="w-full"
        />
      </td>
      <td className="text-right py-1">
        <button
          name="_action"
          value={`delete-ingredient.${ingredient.id}`}
          onClick={deleteIngredient}
        >
          <TrashIcon />
        </button>
      </td>
    </tr>
  );
}

type NewIngredientRowProps = {
  ingredient: Pick<IngredientType, "id" | "name" | "amount">;
  onCreate: () => void;
  focusWhen: boolean;
};
function NewIngredientRow({
  ingredient,
  onCreate,
  focusWhen,
}: NewIngredientRowProps) {
  const form = useForm(ingredient);
  const fetcher = useFetcher();
  const amountRef = useFocusOnce(focusWhen);

  const create = () => {
    onCreate();
    fetcher.submit(
      {
        _action: "add-ingredient",
        id: ingredient.id,
        name: form.values.name,
        amount: form.values.amount,
      },
      { method: "post" }
    );
  };

  const onBlur = (name: "name" | "amount") =>
    form.ifChanged(name, () => {
      if (name === "name") {
        create();
      }
    });

  const isCreating =
    fetcher.submission?.formData.get("_action") === "add-ingredient";

  if (fetcher.type === "done") {
    return null;
  }

  return (
    <tr key={ingredient.id}>
      <td className="pr-4 py-1">
        <TextInput
          name={`ingredient.${ingredient.id}.amount`}
          inputRef={amountRef}
          value={form.values.amount}
          onChange={(e) => form.setValue("amount", e.target.value)}
          placeholder="---"
          onBlur={() => onBlur("amount")}
          onEnter={(e) => {
            e.preventDefault();
            create();
          }}
          className="w-full"
          disabled={isCreating}
        />
      </td>
      <td className="pr-4 py-1">
        <TextInput
          name={`ingredient.${ingredient.id}.name`}
          placeholder="---"
          value={form.values.name}
          onChange={(e) => form.setValue("name", e.target.value)}
          onBlur={() => onBlur("name")}
          onEnter={(e) => {
            e.preventDefault();
            create();
          }}
          className="w-full"
          disabled={isCreating}
        />
      </td>
      <td className="text-right py-1">
        <button
          name="_action"
          value="add-ingredient"
          disabled={isCreating}
          onClick={create}
        >
          {isCreating ? <ThreeDotsIcon /> : <SaveIcon />}
        </button>
      </td>
    </tr>
  );
}
