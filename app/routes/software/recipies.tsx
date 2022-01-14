import { LoaderFunction, Outlet, Link } from "remix";
import { useLoaderData } from "remix";

export const loader: LoaderFunction = () => {
  return [
    { id: 1, name: "Cheesy Potato Soup" },
    { id: 2, name: "Chinese Casserole" },
    { id: 3, name: "Breakfast Casserole" },
  ];
};

type Recipie = {
  id: number;
  name: string;
};

export default function Recipies() {
  const data = useLoaderData<Recipie[]>();
  return (
    <div>
      <h1 className="text-xl mb-2">Recipies</h1>
      <div className="flex flex-col">
        {data.map((recipie) => (
          <Link key={recipie.id} to={`${recipie.id}`}>
            {recipie.name}
          </Link>
        ))}
      </div>
      <br />
      <Outlet />
    </div>
  );
}
