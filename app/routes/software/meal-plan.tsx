import { Form, NavLink, Outlet, useParams } from "remix";
import { SearchBar } from "~/components/forms";
import { classNames, useRouteData } from "~/utils/misc";
import { RecipeCard } from "~/components/lib";
import { LoaderData } from "./meal-plan/$day";
import React from "react";

export default function MealPlan() {
  const data = useRouteData<LoaderData>("routes/software/meal-plan/$day");
  const params = useParams();
  return (
    <div className="flex w-full h-full overflow-x-auto snap-mandatory snap-x">
      <ul
        className={classNames(
          "w-[calc(100vw-2rem)]",
          "flex flex-col h-full lg:flex-auto lg:w-0 lg:flex",
          "overflow-auto border-r-2 border-r-gray-200",
          params.day ? "hidden" : ""
        )}
      >
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day) => (
          <li key={day} className="flex-grow flex-shrink-0">
            <NavLink to={day.toLowerCase()}>
              {({ isActive }) => (
                <div
                  className={classNames(
                    "h-full p-4 border-b-2 border-b-gray-200",
                    "flex flex-col justify-center",
                    isActive ? "text-white font-bold bg-primary" : ""
                  )}
                >
                  {day}
                </div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      <SnapSection className="lg:px-6">
        <Outlet />
      </SnapSection>
      <SnapSection className={!params.day ? "hidden" : ""}>
        <h1 className="py-4 text-center uppercase font-bold tracking-wide">
          Search
        </h1>
        <SearchBar
          action={`/software/meal-plan/${params.day}`}
          placeholder="Search recipes"
        />
        <ul className="my-4">
          {data?.searchedRecipes.map((recipe) => (
            <li key={recipe.id} className="my-4">
              <Form
                reloadDocument
                method="post"
                action={`/software/meal-plan/${params.day}`}
              >
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
      </SnapSection>
    </div>
  );
}

function SnapSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "w-[calc(100vw-2rem)] flex-none snap-center",
        "md:w-[calc(100vw-6rem)]",
        "lg:flex-auto lg:w-0 overflow-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
