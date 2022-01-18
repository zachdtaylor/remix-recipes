import {
  Outlet,
  NavLink,
  useParams,
  useLocation,
  redirect,
  useSearchParams,
} from "remix";
import type { LoaderFunction, ActionFunction } from "remix";
import { useLoaderData } from "remix";
import type { Recipe as RecipeType } from "@prisma/client";
import * as Recipe from "~/model/recipe";
import { PrimaryButton, RecipeCard } from "~/components/lib";
import { PlusIcon } from "~/components/icons";
import { classNames } from "~/utils/misc";

type LoaderData = {
  recipes: Array<RecipeType>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  return {
    recipes: await Recipe.searchRecipes(q),
  };
};

export const action: ActionFunction = async () => {
  const recipe = await Recipe.createNewRecipe();
  return redirect(`recipes/${recipe.id}`);
};

export default function Recipes() {
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  return (
    <div className="lg:flex h-full">
      <div
        className={classNames(
          "lg:block lg:w-1/3 lg:pr-8 overflow-auto",
          params.id ? "hidden" : ""
        )}
      >
        <form>
          <input
            className="w-full py-3 px-2 border-2 border-gray-300 rounded-md"
            type="text"
            name="q"
            placeholder="Search recipes"
            defaultValue={searchParams.get("q") || ""}
            autoComplete="off"
          />
        </form>
        <ul>
          <li className="my-4">
            <form method="post" action="/software/recipes">
              <PrimaryButton className="w-full">
                <PlusIcon /> Add New
              </PrimaryButton>
            </form>
          </li>
          {data?.recipes.map((recipe) => (
            <li className="my-4">
              <NavLink
                key={recipe.id}
                to={{ pathname: recipe.id, search: location.search }}
              >
                {({ isActive }) => (
                  <RecipeCard
                    title={recipe.name}
                    totalTime={recipe.totalTime}
                    isActive={isActive}
                  />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <br />
      </div>
      <div className="lg:w-2/3 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
