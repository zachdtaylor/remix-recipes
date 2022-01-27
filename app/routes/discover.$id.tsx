import { LoaderFunction, useLoaderData, json } from "remix";
import invariant from "tiny-invariant";
import { Heading2 } from "~/components/heading";
import { TimeIcon } from "~/components/icons";
import { PageTitle, PageWrapper } from "~/components/lib";

import * as Recipe from "~/model/recipe";

type LoaderData = {
  recipe: Awaited<ReturnType<typeof Recipe.getRecipe>>;
};
export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  const recipe = await Recipe.getRecipe(id);
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
  return { recipe };
};

export default function DiscoverRecipe() {
  const data = useLoaderData<LoaderData>();
  invariant(data.recipe !== null, "Recipe came back null");
  return (
    <PageWrapper className="overflow-auto">
      <PageTitle>{data.recipe.name}</PageTitle>
      <div className="flex font-light text-gray-500 items-center pb-4">
        <TimeIcon />
        <p className="pl-2">{data.recipe.totalTime}</p>
      </div>
      <div className="md:flex">
        <img
          src={data.recipe.image}
          className="rounded-md shadow-md mb-8 md:max-h-96"
        />
        <div className="md:pl-4">
          <Heading2>Ingredients</Heading2>
          <ul className="py-4">
            {data.recipe.ingredients.map((ingredient) => (
              <li className="py-1">{`${ingredient.amount.trim()} ${ingredient.name.trim()}`}</li>
            ))}
          </ul>
          <Heading2>Instructions</Heading2>
          <p className="py-4">{data.recipe.instructions}</p>
        </div>
      </div>
    </PageWrapper>
  );
}
