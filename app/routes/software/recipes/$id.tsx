import type {
  Ingredient as IngredientType,
  Recipe as RecipeType,
} from "@prisma/client";
import {
  LoaderFunction,
  ActionFunction,
  redirect,
  Form,
  useFetcher,
  useTransition,
  FormMethod,
} from "remix";
import { useLoaderData, json, useCatch, ErrorBoundaryComponent } from "remix";
import { TextArea, TextInput } from "~/components/forms";
import { Heading2 } from "~/components/heading";
import {
  PlusIcon,
  ThreeDotsIcon,
  TimeIcon,
  TrashIcon,
} from "~/components/icons";
import { DeleteButton, ErrorSection, PrimaryButton } from "~/components/lib";
import * as Recipe from "~/model/recipe";
import * as Ingredient from "~/model/ingredient";
import { parseRecipieFormData } from "~/utils/http";
import { formatDateTime, maxDate, useMounted } from "~/utils/misc";
import invariant from "tiny-invariant";
import { validateRecipe } from "~/utils/validation";
import React from "react";

type LoaderData = {
  recipe: RecipeType & { ingredients: Array<IngredientType> };
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
    .filter((key) => key.split(".")[0] === "ingredient")
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
  const id = params.id;
  if (typeof id === "undefined") {
    return null;
  }
  const formData = await parseRecipieFormData(request);
  if (formData._action === "delete") {
    await Recipe.deleteRecipe(id);
    return redirect("/software/recipes");
  }
  if (formData._action === "add-ingredient") {
    return Ingredient.createIngredient(id);
  }
  if (formData._action?.includes("delete-ingredient")) {
    const ingredientId = formData._action.split(".")[1];
    return Ingredient.deleteIngredient(ingredientId);
  }
  // const errors = validateRecipe(formData);
  // if (!isEmpty(errors)) {
  //   return { id, errors };
  // }
  return saveRecipie(id, formData);
};

function createClientIngredient(ingredients: Array<Partial<IngredientType>>) {
  return {
    id: `new-${ingredients.length + 1}`,
    amount: "",
    name: "",
  };
}

export default function RecipeRoute() {
  const data = useLoaderData<LoaderData>();
  const transition = useTransition();
  const nameFetcher = useFetcher();
  const timeFetcher = useFetcher();
  const otherFetcher = useFetcher();
  const [newIngredients, setNewIngredients] = React.useState<
    Array<Partial<IngredientType>>
  >([]);
  const [deletedIds, setDeletedIds] = React.useState<Array<string>>([]);
  const mounted = useMounted();

  React.useEffect(() => {
    if (transition.state === "idle") {
      setNewIngredients([]);
    }
  }, [transition.state]);

  const save = (name: string, value: string) => {
    const target = { _action: "save", [name]: value };
    const options: { method: FormMethod } = { method: "post" };
    return name === "name"
      ? nameFetcher.submit(target, options)
      : name === "totalTime"
      ? timeFetcher.submit(target, options)
      : otherFetcher.submit(target, options);
  };

  return (
    <Form id="recipe-form" method="post">
      <TextInput
        inputKey={data.recipe.id}
        name="name"
        placeholder="Recipie Name"
        defaultValue={data.recipe.name}
        onChanged={(e) => save("name", e.target.value)}
        error={
          nameFetcher.data?.id === data.recipe.id &&
          nameFetcher.data?.errors.name
        }
        className="text-2xl font-extrabold mb-2 w-full"
      />
      <div className="flex justify-between items-center">
        <div className="flex font-light text-gray-500 items-center">
          <TimeIcon />
          <TextInput
            inputKey={data.recipe.id}
            name="totalTime"
            placeholder="Time"
            defaultValue={data.recipe.totalTime}
            onChanged={(e) => save("totalTime", e.target.value)}
            error={
              timeFetcher.data?.id === data.recipe.id &&
              timeFetcher.data?.errors.totalTime
            }
            className="ml-1"
          />
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex items-center mb-2">
        <Heading2 className="mr-2">Ingredients</Heading2>
        <button
          name="_action"
          value="add-ingredient"
          className="text-lg"
          onClick={() => {
            setNewIngredients((ingredients) => [
              ...ingredients,
              createClientIngredient(ingredients),
            ]);
          }}
        >
          <PlusIcon />
        </button>
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
          {newIngredients.map((ingredient) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              save={save}
              disabled
            />
          ))}
          {data.recipe.ingredients.map((ingredient) =>
            !!deletedIds.find((id) => id === ingredient.id) ? null : (
              <IngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                save={save}
                onDelete={() => {
                  setDeletedIds((ids) => [...ids, ingredient.id]);
                  otherFetcher.submit(
                    { _action: `delete-ingredient.${ingredient.id}` },
                    { method: "post" }
                  );
                }}
              />
            )
          )}
        </tbody>
      </table>
      <Heading2 className="mb-2">Instructions</Heading2>
      <TextArea
        key={data.recipe.id}
        name="instructions"
        placeholder="Instructions"
        defaultValue={data.recipe.instructions}
        onChanged={(e) => save("instructions", e.target.value)}
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
        <DeleteButton name="_action" value="delete">
          Delete this Recipe
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
  ingredient: Partial<IngredientType>;
  save: (name: string, value: string) => void;
  disabled?: boolean;
  onDelete?: () => void;
};
function IngredientRow({
  ingredient,
  save,
  disabled,
  onDelete,
}: IngredientRowProps) {
  return (
    <tr key={ingredient.id}>
      <td className="pr-4 py-1">
        <TextInput
          name={`ingredient.${ingredient.id}.amount`}
          defaultValue={ingredient.amount}
          placeholder="---"
          onChanged={(e) =>
            save(`ingredient.${ingredient.id}.amount`, e.target.value)
          }
          className="w-full"
          disabled={disabled}
        />
      </td>
      <td className="pr-4 py-1">
        <TextInput
          name={`ingredient.${ingredient.id}.name`}
          defaultValue={ingredient.name}
          placeholder="---"
          onChanged={(e) =>
            save(`ingredient.${ingredient.id}.name`, e.target.value)
          }
          className="w-full"
          disabled={disabled}
        />
      </td>
      <td className="text-right py-1">
        <button
          name="_action"
          value={`delete-ingredient.${ingredient.id}`}
          disabled={disabled}
          onClick={onDelete}
        >
          {disabled ? <ThreeDotsIcon /> : <TrashIcon />}
        </button>
      </td>
    </tr>
  );
}
