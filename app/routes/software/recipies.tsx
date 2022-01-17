import {
  LoaderFunction,
  Outlet,
  Link,
  useParams,
  Form,
  useLocation,
} from "remix";
import { useLoaderData } from "remix";
import type { Recipie } from "@prisma/client";
import { db } from "~/utils/db";
import { RecipieCard } from "~/components/lib";

type LoaderData = {
  recipies: Array<Recipie>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  return {
    recipies: await db.recipie.findMany({
      where: {
        name: {
          contains: q || "",
          mode: "insensitive",
        },
      },
    }),
  };
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
        <Form>
          <input
            className="w-full py-3 px-2 border-2 border-gray-300 rounded-md"
            type="text"
            name="q"
            placeholder="Search recipies"
            autoComplete="off"
          />
        </Form>
        <ul>
          {data.recipies.map((recipie) => (
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
