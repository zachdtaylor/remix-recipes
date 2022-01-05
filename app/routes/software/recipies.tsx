import type { LoaderFunction } from "remix";
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
      {data.map((recipie) => (
        <div key={recipie.id}>{recipie.name}</div>
      ))}
    </div>
  );
}
