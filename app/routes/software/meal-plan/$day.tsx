import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import { SearchBar } from "~/components/forms";
import { requireAuthSession } from "~/utils/auth.server";
import * as Recipe from "~/model/recipe";
import * as MealPlanController from "~/controllers/meal-plan-controller.server";
import { RecipeCard } from "~/components/lib";
import { Day as DayType } from "@prisma/client";

type LoaderData = {
  searchedRecipes: Awaited<ReturnType<typeof Recipe.searchRecipes>>;
  dayPlan: Awaited<ReturnType<typeof MealPlanController.getDayPlan>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const [searched, planned] = await Promise.all([
    MealPlanController.searchRecipes(userId, params.day as DayType, q),
    MealPlanController.getDayPlan(userId, params.day as DayType),
  ]);
  return {
    searchedRecipes: searched,
    dayPlan: planned,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  const formData = await request.formData();
  switch (formData.get("_action")) {
    case "add-recipe":
      return MealPlanController.addRecipeToMealPlan(
        userId,
        formData.get("recipeId"),
        params.day
      );
    case "remove-recipe":
      return MealPlanController.removeRecipeFromMealPlan(
        formData.get("planItemId")
      );
    default:
      return null;
  }
};

export default function MealPlanDay() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <ul>
        {data.dayPlan.map((item) => (
          <li key={item.id} className="my-4">
            <Form reloadDocument method="post">
              <input type="hidden" name="planItemId" value={item.id} />
              <button name="_action" value="remove-recipe" className="w-full">
                <RecipeCard
                  title={item.recipe.name}
                  totalTime={item.recipe.totalTime}
                  image={item.recipe.image}
                />
              </button>
            </Form>
          </li>
        ))}
      </ul>
      <SearchBar placeholder="Search recipes" />
      <ul className="my-4">
        {data.searchedRecipes.map((recipe) => (
          <li key={recipe.id} className="my-4">
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
