import { LoaderFunction, redirect } from "remix";
import { deleteUser } from "~/model/user";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    throw new Error("email is required to delete user");
  }

  await deleteUser(email);
  return redirect("/");
};
