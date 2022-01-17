import type {
  Ingredient as IngredientType,
  Recipie as RecipieType,
} from "@prisma/client";
import {
  LoaderFunction,
  useLoaderData,
  json,
  useCatch,
  ErrorBoundaryComponent,
} from "remix";
import { Heading1, Heading2 } from "~/components/heading";
import { ErrorSection, RecipieTime } from "~/components/lib";
import * as Recipie from "~/model/recipie";

type LoaderData = {
  recipie: RecipieType & { ingredients: Array<IngredientType> };
};
export const loader: LoaderFunction = async ({ params }) => {
  const recipie = await Recipie.getRecipie(params.id);
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

export default function RecipieRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <Heading1>{data.recipie.name}</Heading1>
      <RecipieTime totalTime={data.recipie.totalTime} />
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
