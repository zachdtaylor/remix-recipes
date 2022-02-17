import { LoaderFunction, redirect } from "remix";
import { createUser, getUserByEmail } from "~/model/user";
import { generateMagicLink } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const firstName = url.searchParams.get("firstName");
  const lastName = url.searchParams.get("lastName");
  const email = url.searchParams.get("email");

  if (!email) {
    throw new Error("email is required to log in");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    if (!firstName) {
      throw new Error("first name is required to log in");
    }
    if (!lastName) {
      throw new Error("last name is required to log in");
    }
    await createUser({ firstName, lastName, email });
  }

  return redirect(generateMagicLink(email));
};
