import { redirect } from "remix";

export const loader = () => {
  return redirect("/software/recipes");
};
