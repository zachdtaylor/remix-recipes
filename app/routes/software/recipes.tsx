import {
  Outlet,
  NavLink,
  useParams,
  useLocation,
  redirect,
  useSearchParams,
  Form,
  useTransition,
  useFetchers,
} from "remix";
import type { LoaderFunction, ActionFunction } from "remix";
import { useLoaderData } from "remix";
import type { Recipe as RecipeType } from "@prisma/client";
import * as Recipe from "~/model/recipe";
import { PrimaryButton } from "~/components/forms";
import { RecipeCard } from "~/components/lib";
import { LoadingIcon, PlusIcon, SearchIcon } from "~/components/icons";
import { classNames } from "~/utils/misc";
import { requireAuthSession } from "~/utils/auth.server";

type LoaderData = {
  recipes: Array<RecipeType>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  return {
    recipes: await Recipe.searchRecipes(session.get("userId"), q),
  };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const recipe = await Recipe.createRecipe(session.get("userId"));
  return redirect(`/software/recipes/${recipe.id}`);
};

export default function Recipes() {
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const transition = useTransition();
  const fetchers = useFetchers();

  const isSearchSubmitting = transition.submission?.formData.has("q");
  const isAddSubmitting =
    transition.submission?.formData.get("_action") === "add";

  return (
    <div className="lg:flex h-full">
      <div
        className={classNames(
          "lg:block lg:w-1/3 lg:pr-4 overflow-auto",
          params.id ? "hidden" : ""
        )}
      >
        <Form className="flex border-2 border-gray-300 rounded-md">
          <button className="pl-3 pr-2 mr-1">
            {isSearchSubmitting ? <LoadingIcon /> : <SearchIcon />}
          </button>
          <input
            className="w-full py-3 px-2 rounded-md"
            type="text"
            name="q"
            placeholder="Search recipes"
            defaultValue={searchParams.get("q") || ""}
            autoComplete="off"
          />
        </Form>
        <ul>
          <li className="my-4">
            <Form method="post" action="/software/recipes">
              <input type="hidden" name="_action" value="add" />
              <PrimaryButton className="w-full" disabled={isAddSubmitting}>
                <PlusIcon />
                {isAddSubmitting ? "Adding" : "Add New"}
              </PrimaryButton>
            </Form>
          </li>
          {data?.recipes.map((recipe) => {
            const isNext = !!transition.location?.pathname?.includes(recipe.id);
            const isLoading = isNext && transition.type === "normalLoad";

            const optimisticData = new Map();
            for (const fetcher of fetchers) {
              if (
                fetcher.submission?.action?.includes(recipe.id) &&
                fetcher.submission.formData.get("_action") === "save"
              ) {
                if (fetcher.submission.formData.has("name")) {
                  optimisticData.set(
                    "name",
                    fetcher.submission.formData.get("name")
                  );
                }
                if (fetcher.submission.formData.has("totalTime")) {
                  optimisticData.set(
                    "totalTime",
                    fetcher.submission.formData.get("totalTime")
                  );
                }
              }
            }

            const title = optimisticData.get("name") || recipe.name;
            const totalTime =
              optimisticData.get("totalTime") || recipe.totalTime;

            return (
              <li className="my-4" key={recipe.id}>
                <NavLink
                  key={recipe.id}
                  to={{ pathname: recipe.id, search: location.search }}
                >
                  {({ isActive }) => (
                    <RecipeCard
                      title={`${title}${isLoading ? "..." : ""}`}
                      totalTime={totalTime}
                      image={recipe.image}
                      isActive={isActive}
                      isLoading={isLoading}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <br />
      </div>
      <div className="lg:w-2/3 overflow-auto pr-4 pl-4">
        <Outlet />
      </div>
    </div>
  );
}
