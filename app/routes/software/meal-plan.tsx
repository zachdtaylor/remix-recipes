import { Form, NavLink, Outlet, useParams } from "remix";
import { SearchBar } from "~/components/forms";
import { classNames, daysOfTheWeek, useRouteData } from "~/utils/misc";
import { RecipeCard } from "~/components/lib";
import { LoaderData } from "./meal-plan/$day";
import React from "react";

function getLink(text: string) {
  if (text === "Shopping List") {
    return "shopping-list";
  }
  return text.toLowerCase();
}

export default function MealPlan() {
  const data = useRouteData<LoaderData>("routes/software/meal-plan/$day");
  const params = useParams();
  return (
    <div
      className={classNames(
        "flex w-full h-full overflow-x-auto snap-mandatory snap-x"
      )}
    >
      <SnapSection className="lg:flex-auto">
        <div className="h-full ">
          <ul
            className={classNames(
              "flex flex-col h-full",
              "lg:border-r-2 lg:border-r-gray-200"
            )}
          >
            {["Shopping List", ...daysOfTheWeek()].map((item) => (
              <li
                key={item}
                className="lg:flex-grow lg:flex-shrink-0 h-20 lg:h-0"
              >
                <NavLink to={getLink(item)}>
                  {({ isActive }) => (
                    <div
                      className={classNames(
                        "h-full p-4 border-b-2 border-b-gray-200",
                        "flex flex-col justify-center",
                        isActive ? "text-white font-bold bg-primary" : ""
                      )}
                    >
                      {item}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </SnapSection>
      <SnapSection
        className={classNames(
          "lg:px-6",
          params.day ? "lg:flex-grow" : "grow-[2]"
        )}
      >
        <Outlet />
      </SnapSection>
      <SnapSection
        className={classNames("lg:flex-grow", !params.day ? "hidden" : "")}
      >
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
        "lg:w-0 overflow-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
