import type {
  Ingredient as IngredientType,
  Recipe as RecipeType,
} from "@prisma/client";
import { LoaderFunction, ActionFunction, redirect } from "remix";
import { useLoaderData, json, useCatch, ErrorBoundaryComponent } from "remix";
import { Heading1, Heading2 } from "~/components/heading";
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
  recipie: RecipeType & { ingredients: Array<IngredientType> };
};
export const loader: LoaderFunction = async ({ params }) => {
  const recipie = await Recipe.getRecipe(params.id);
  if (recipie === null) {
    throw json(
      {
        message: `A recipie with id "${params.id}" does not exist.`,
      },
      {
        status: 404,
      }
    );
  }
  return {
    recipie,
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
        defaultValue={data.recipie.name}
        autoComplete="off"
        className={classNames(
          "text-2xl font-extrabold mb-2 outline-none w-full",
          "border-b-2 border-b-white focus:border-b-primary"
        )}
      />
      <RecipeTime totalTime={data.recipie.totalTime} />
      <hr className="my-4" />
      <Heading2>Ingredients</Heading2>
      <ul className="mb-4">
        {data.recipie.ingredients.map((ingredient) => (
          <li className="my-1">
            {ingredient.amount} {ingredient.name}
          </li>
        ))}
      </ul>
      <Heading2>Instructions</Heading2>
      <div>{data.recipie.instructions}</div>
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
