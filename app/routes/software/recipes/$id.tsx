import type {
  Ingredient as IngredientType,
  Recipe as RecipeType,
} from "@prisma/client";
import { LoaderFunction, ActionFunction, redirect } from "remix";
import { useLoaderData, json, useCatch, ErrorBoundaryComponent } from "remix";
import { Heading2 } from "~/components/heading";
import { TimeIcon } from "~/components/icons";
import {
  DeleteButton,
  ErrorSection,
  PrimaryButton,
  RecipeTime,
} from "~/components/lib";
import * as Recipe from "~/model/recipe";
import { parseFormData } from "~/utils/http";
import { classNames } from "~/utils/misc";

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

export const action: ActionFunction = async ({ params, request }) => {
  const id = params.id;
  if (typeof id === "undefined") {
    return null;
  }
  const formData = await parseFormData(request);
  if (formData._action === "delete") {
    await Recipe.deleteRecipe(id);
    return redirect("..");
  }
  if (formData._action === "save") {
    return Recipe.updateRecipe(id, {
      name: formData.name,
      totalTime: formData.totalTime,
      instructions: formData.instructions,
    });
  }
  return null;
};

export default function RecipeRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <form method="post">
      <input
        type="text"
        name="name"
        placeholder="Recipie Name"
        defaultValue={data.recipe.name}
        autoComplete="off"
        className={classNames(
          "text-2xl font-extrabold mb-2 outline-none w-full",
          "border-b-2 border-b-white focus:border-b-primary"
        )}
      />
      <div className="flex font-light text-gray-500">
        <TimeIcon />
        <input
          type="text"
          name="totalTime"
          placeholder="Time"
          autoComplete="off"
          defaultValue={data.recipe.totalTime}
          className={classNames(
            "ml-1 outline-none",
            "border-b-2 border-b-white focus:border-b-primary"
          )}
        />
      </div>
      <hr className="my-4" />
      <Heading2>Ingredients</Heading2>
      <ul className="mb-4">
        {data.recipe.ingredients.map((ingredient) => (
          <li className="my-1">
            {ingredient.amount} {ingredient.name}
          </li>
        ))}
      </ul>
      <Heading2>Instructions</Heading2>
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
