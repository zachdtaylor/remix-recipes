import {
  ActionFunction,
  ErrorBoundaryComponent,
  Form,
  LoaderFunction,
  useLoaderData,
  useParams,
  json,
  useCatch,
} from "remix";
import { requireAuthSession } from "~/utils/auth.server";
import * as Recipe from "~/model/recipe";
import * as MealPlanController from "~/controllers/meal-plan-controller.server";
import { ErrorSection, RecipeCard } from "~/components/lib";
import { daysOfTheWeek } from "~/utils/misc";

export type LoaderData = {
  searchedRecipes: Awaited<ReturnType<typeof Recipe.searchRecipes>>;
  dayPlan: Awaited<ReturnType<typeof MealPlanController.getDayPlan>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  if (!daysOfTheWeek().find((day) => day.toLowerCase() === params.day)) {
    throw json(
      { message: `${params.day} is not a day of the week` },
      { status: 400 }
    );
  }
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const [searched, planned] = await Promise.all([
    MealPlanController.searchRecipes(userId, q, params.day),
    MealPlanController.getDayPlan(userId, params.day),
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
  const params = useParams();
  return (
    <div>
      <h1 className="py-4 text-center uppercase font-bold tracking-wide">
        {params.day}
      </h1>
      <ul>
        {data.dayPlan.map((item) => (
          <li key={item.id} className="mb-4">
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
    </div>
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

export const CatchBoundary = () => {
  const caught = useCatch();
  return (
    <ErrorSection title={caught.statusText} message={caught.data.message} />
  );
};
