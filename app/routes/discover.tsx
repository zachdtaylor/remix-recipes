import { Link, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { PageWrapper, PageTitle } from "~/components/lib";
import { Recipe as RecipeType, User as UserType } from "@prisma/client";
import * as Recipe from "~/model/recipe";

export const meta: MetaFunction = () => {
  return {
    title: "Home | Remix Recipes",
    description: "Come find some good recipes!",
  };
};

type LoaderData = {
  recipes: Array<RecipeType & { user: UserType }>;
};
export const loader: LoaderFunction = async () => {
  return { recipes: await Recipe.getRecipes() };
};

export default function Home() {
  const data = useLoaderData<LoaderData>();
  return (
    <PageWrapper className="overflow-auto pb-4">
      <PageTitle>Discover</PageTitle>
      <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.recipes.map((recipe) => (
          <li key={recipe.id} className="shadow-md rounded-md">
            <Link to={recipe.id}>
              <div className="h-48 overflow-hidden">
                <img
                  src={recipe.image}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h1 className="font-bold text-xl pb-2">{recipe.name}</h1>
                <h2>{`${recipe.user.firstName} ${recipe.user.lastName}`}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </PageWrapper>
  );
}

export const handle = {
  hydrate: false,
};
