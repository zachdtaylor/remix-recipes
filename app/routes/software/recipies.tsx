import { Outlet, Link, useParams, useLocation, redirect } from "remix";
import type { LoaderFunction, ActionFunction } from "remix";
import { useLoaderData } from "remix";
import type { Recipie as RecipieType } from "@prisma/client";
import * as Recipie from "~/model/recipie";
import { PrimaryButton, RecipieCard } from "~/components/lib";
import { PlusIcon } from "~/components/icons";

type LoaderData = {
  recipies: Array<RecipieType>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  return {
    recipies: await Recipie.searchRecipies(q),
  };
};

export const action: ActionFunction = async () => {
  const recipie = await Recipie.createNewRecipie();
  return redirect(`recipies/${recipie.id}`);
};

export default function Recipies() {
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  const location = useLocation();
  return (
    <div className="lg:flex h-full">
      <div
        className={`${
          params.id ? "hidden" : ""
        } lg:block lg:w-1/3 lg:mr-8 overflow-auto`}
      >
        <form>
          <input
            className="w-full py-3 px-2 border-2 border-gray-300 rounded-md"
            type="text"
            name="q"
            placeholder="Search recipies"
            autoComplete="off"
          />
        </form>
        <ul>
          <li className="my-4">
            <form method="post" action="/software/recipies">
              <PrimaryButton className="w-full">
                <PlusIcon /> Add New
              </PrimaryButton>
            </form>
          </li>
          {data?.recipies.map((recipie) => (
            <li className="my-4">
              <Link
                key={recipie.id}
                to={{ pathname: recipie.id, search: location.search }}
              >
                <RecipieCard
                  title={recipie.name}
                  totalTime={recipie.totalTime}
                />
              </Link>
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
