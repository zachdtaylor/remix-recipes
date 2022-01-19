import type {
  Ingredient as IngredientType,
  Recipe as RecipeType,
} from "@prisma/client";
import { LoaderFunction, ActionFunction, redirect } from "remix";
import { useLoaderData, json, useCatch, ErrorBoundaryComponent } from "remix";
import { TextInput } from "~/components/forms";
import { Heading2 } from "~/components/heading";
import { PlusIcon, TimeIcon, TrashIcon } from "~/components/icons";
import { DeleteButton, ErrorSection, PrimaryButton } from "~/components/lib";
import * as Recipe from "~/model/recipe";
import * as Ingredient from "~/model/ingredient";
import { parseRecipieFormData } from "~/utils/http";
import { classNames } from "~/utils/misc";
import invariant from "tiny-invariant";

type LoaderData = {
  recipe: RecipeType & { ingredients: Array<IngredientType> };
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
  };
};

function saveRecipie(
  id: string,
  formData: { [key: string]: string | undefined }
) {
  const recipiePromise = Recipe.updateRecipe(id, {
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
      return Ingredient.updateIngredient(id, { [name]: formData[key] });
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
    return redirect("..");
  }
  if (formData._action === "save") {
    return saveRecipie(id, formData);
  }
  if (formData._action === "add-ingredient") {
    return Ingredient.createIngredient(id);
  }
  if (formData._action?.includes("delete-ingredient")) {
    const ingredientId = formData._action.split(".")[1];
    return Ingredient.deleteIngredient(ingredientId);
  }
  return null;
};

export default function RecipeRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <form method="post">
      <TextInput
        name="name"
        placeholder="Recipie Name"
        defaultValue={data.recipe.name}
        className="text-2xl font-extrabold mb-2 w-full"
      />
      <div className="flex justify-between">
        <div className="flex font-light text-gray-500 items-center">
          <TimeIcon />
          <TextInput
            name="totalTime"
            placeholder="Time"
            defaultValue={data.recipe.totalTime}
            className="ml-1"
          />
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex items-center mb-2">
        <Heading2 className="mr-2">Ingredients</Heading2>
        <button name="_action" value="add-ingredient" className="text-lg">
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
          {data.recipe.ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td className="pr-4">
                <TextInput
                  name={`ingredient.${ingredient.id}.amount`}
                  defaultValue={ingredient.amount}
                  className="w-full"
                />
              </td>
              <td className="pr-4">
                <TextInput
                  name={`ingredient.${ingredient.id}.name`}
                  defaultValue={ingredient.name}
                  className="w-full"
                />
              </td>
              <td className="text-right">
                <button
                  name="_action"
                  value={`delete-ingredient.${ingredient.id}`}
                >
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Heading2 className="mb-2">Instructions</Heading2>
      <textarea
        name="instructions"
        placeholder="Instructions"
        defaultValue={data.recipe.instructions}
        className={classNames(
          "w-full h-56 outline-none rounded-md",
          "border-2 border-white focus:border-primary",
          "focus:p-3 transition-all duration-300"
        )}
      />
      <hr className="my-4" />
      <div className="flex justify-between">
        <PrimaryButton name="_action" value="save">
          Save
        </PrimaryButton>
        <DeleteButton name="_action" value="delete">
          Delete this Recipe
        </DeleteButton>
      </div>
    </form>
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
