import type { Ingredient, Recipie } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { Heading1, Heading2 } from "~/components/heading";
import { RecipieTime } from "~/components/lib";
import { db } from "~/utils/db";

type LoaderData = {
  recipie: Recipie & { ingredients: Array<Ingredient> };
};
export const loader: LoaderFunction = async ({ params }) => {
  return {
    recipie: await db.recipie.findUnique({
      where: { id: params.id },
      include: { ingredients: true },
    }),
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
