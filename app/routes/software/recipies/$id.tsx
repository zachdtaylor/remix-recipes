import { LoaderFunction, useFetcher, useLoaderData, useMatches } from "remix";
import { Recipie as RecipieComponent } from "~/components/recipie";

export const loader: LoaderFunction = ({ params }) => {
  return { id: params.id, name: "Cheesy Potato Soup" };
};

export default function Recipie() {
  return <RecipieComponent />;
}

export const handle = {
  sup: "my guy",
};
