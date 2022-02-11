import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import { SearchBar } from "~/components/forms";
import { requireAuthSession } from "~/utils/auth.server";
import * as Recipe from "~/model/recipe";
import { RecipeCard } from "~/components/lib";

type LoaderData = {
  recipes: Awaited<ReturnType<typeof Recipe.searchRecipes>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireAuthSession(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  return {
    recipes: await Recipe.searchRecipes(session.get("userId"), q),
  };
};

export const action: ActionFunction = async () => {
  return null;
};

export default function Day() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <SearchBar placeholder="Search recipes" />
      <ul className="my-4">
        {data.recipes.map((recipe) => (
          <li className="my-4">
            <Form reloadDocument method="post">
              <input type="hidden" name="recipeId" value={recipe.id} />
              <button name="_action" value="add-recipe" className="w-full">
                <RecipeCard
                  title={recipe.name}
                  totalTime={recipe.totalTime}
                  image={recipe.image}
                />
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  );
}
