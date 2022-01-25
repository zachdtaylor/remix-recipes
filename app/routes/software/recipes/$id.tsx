import type {
  Ingredient as IngredientType,
  Recipe as RecipeType,
} from "@prisma/client";
import type { LoaderFunction, ActionFunction } from "remix";

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
import invariant from "tiny-invariant";

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
import { parseRecipieFormData } from "~/utils/http";
import {
  formatDateTime,
  maxDate,
  useFocusOnce,
  useForm,
  useMounted,
} from "~/utils/misc";
import { validateRecipe } from "~/utils/validation";

type PickedIngredient = Pick<IngredientType, "id" | "amount" | "name">;
type LoaderData = {
  recipe: RecipeType & {
    ingredients: Array<PickedIngredient>;
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

function saveRecipie(
  recipeId: string,
  formData: { [key: string]: string | undefined }
) {
  const recipiePromise = Recipe.updateRecipe(recipeId, {
    name: formData.name,
    totalTime: formData.totalTime,
    instructions: formData.instructions,
    image: formData.image,
  });
  const ingredientPromises = Object.keys(formData)
    .filter((key) => {
      const [inputType, id, _] = key.split(".");
      return inputType === "ingredient" && id !== "";
    })
    .map((key) => {
      const [_, id, name] = key.split(".");
      invariant(
        name === "amount" || name === "name",
        `invalid form input name ${key}`
      );
      return Ingredient.createOrUpdateIngredient(recipeId, id, {
        [name]: formData[key],
      });
    });
  return Promise.all([recipiePromise, ...ingredientPromises]);
}

export const action: ActionFunction = async ({ params, request }) => {
  const recipeId = params.id;
  if (typeof recipeId === "undefined") {
    return null;
  }
  const formData = await parseRecipieFormData(request);
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
  // const errors = validateRecipe(formData);
  // if (!isEmpty(errors)) {
  //   return { id, errors };
  // }
  return saveRecipie(recipeId, formData);
};

export default function RecipeRoute() {
  const data = useLoaderData<LoaderData>();
  const { formValues, setValue, ifChanged } = useForm({
    name: data.recipe.name,
    totalTime: data.recipe.totalTime,
    instructions: data.recipe.instructions,
  });
  const fetcher = useFetcher();
  const transition = useTransition();
  const mounted = useMounted();
  const [deletedIds, setDeletedIds] = React.useState<Array<string>>([]);

  const save = () => {
    return fetcher.submit(
      { _action: "save", ...formValues },
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
        value={formValues.name}
        onChange={(e) => setValue("name", e.target.value)}
        onBlur={() => ifChanged("name", save)}
        error={fetcher.data?.id === data.recipe.id && fetcher.data?.errors.name}
        className="text-2xl font-extrabold mb-2 w-full"
      />
      <div className="flex justify-between items-center">
        <div className="flex font-light text-gray-500 items-center">
          <TimeIcon />
          <TextInput
            inputKey={data.recipe.id}
            name="totalTime"
            placeholder="Time"
            value={formValues.totalTime}
            onChange={(e) => setValue("totalTime", e.target.value)}
            onBlur={() => ifChanged("totalTime", save)}
            error={
              fetcher.data?.id === data.recipe.id &&
              fetcher.data?.errors.totalTime
            }
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
          <IngredientRow
            key={data.recipe.ingredients.length}
            ingredient={{
              id: "",
              name: "",
              amount: "",
            }}
          />
        </tbody>
      </table>
      <Heading2 className="mb-2">Instructions</Heading2>
      <TextArea
        key={data.recipe.id}
        name="instructions"
        placeholder="Instructions"
        value={formValues.instructions}
        onChange={(e) => setValue("instructions", e.target.value)}
        onBlur={() => ifChanged("instructions", save)}
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
  ingredient: PickedIngredient;
  onDelete?: () => void;
  onCreate?: () => void;
};
function IngredientRow({ ingredient, onCreate, onDelete }: IngredientRowProps) {
  const isNew = ingredient.id === "";
  const { formValues, setValue, ifChanged } = useForm(ingredient);
  const fetcher = useFetcher();
  const amountRef = useFocusOnce(isNew);

  const save = () => {
    const name = `ingredient.${ingredient.id}.name`;
    const amount = `ingredient.${ingredient.id}.amount`;
    fetcher.submit(
      { _action: "save", [name]: formValues.name, [amount]: formValues.amount },
      { method: "post" }
    );
  };

  const create = () => {
    onCreate?.();
    fetcher.submit(
      {
        _action: "add-ingredient",
        id: ingredient.id,
        name: formValues.name,
        amount: formValues.amount,
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

  const onBlur = (name: "name" | "amount") =>
    ifChanged(name, () => {
      if (isNew && name === "name") {
        create();
      } else {
        save();
      }
    });

  const isCreating =
    fetcher.submission?.formData.get("_action") === "add-ingredient";

  return (
    <tr key={ingredient.id}>
      <td className="pr-4 py-1">
        <TextInput
          name={`ingredient.${ingredient.id}.amount`}
          inputRef={amountRef}
          value={formValues.amount}
          onChange={(e) => setValue("amount", e.target.value)}
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
          value={formValues.name}
          onChange={(e) => setValue("name", e.target.value)}
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
          value={
            isNew ? "add-ingredient" : `delete-ingredient.${ingredient.id}`
          }
          disabled={isCreating}
          onClick={isNew ? create : deleteIngredient}
        >
          {isCreating ? (
            <ThreeDotsIcon />
          ) : isNew ? (
            <SaveIcon />
          ) : (
            <TrashIcon />
          )}
        </button>
      </td>
    </tr>
  );
}
