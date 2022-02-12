import { LoaderFunction, redirect } from "remix";
import { getToday } from "~/utils/misc";

export const loader: LoaderFunction = () => {
  const today = getToday();
  return redirect(`/software/meal-plan/${today.toLowerCase()}`);
};
