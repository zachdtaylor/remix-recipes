import { LoaderFunction, Outlet, Link } from "remix";
import { useLoaderData } from "remix";
import type { Recipie } from "@prisma/client";
import { db } from "~/utils/db";
import { ListCard } from "~/components/list";

type LoaderData = {
  recipies: Array<Recipie>;
};

export const loader: LoaderFunction = async () => {
  return {
    recipies: await db.recipie.findMany(),
  };
};

export default function Recipies() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="lg:flex">
      <div className="lg:w-1/3 lg:mr-8">
        <h1 className="text-xl mb-2">Recipies</h1>
        <ul>
          {data.recipies.map((recipie) => (
            <li className="my-4">
              <Link key={recipie.id} to={recipie.id}>
                <ListCard title={recipie.name} />
              </Link>
            </li>
          ))}
        </ul>
        <br />
      </div>
      <div className="lg:w-2/3">
        <Outlet />
      </div>
    </div>
  );
}
