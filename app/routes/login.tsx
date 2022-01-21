import {
  ActionFunction,
  LoaderFunction,
  redirect,
  json,
  useActionData,
} from "remix";
import { EmailInput } from "~/components/forms";
import { PrimaryButton } from "~/components/lib";
import { generateMagicLink, getSessionUserId } from "~/utils/auth.server";
import { isValidEmail } from "~/utils/validation";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getSessionUserId(request);
  if (userId) {
    return redirect("/");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // Step 1. Validate the form
  const email = formData.get("email");
  if (typeof email !== "string" || !isValidEmail(email)) {
    return json(
      { error: "invalid email", message: "Please provide a valid email" },
      { status: 400 }
    );
  }

  const link = generateMagicLink(email);

  return json({ link });
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div className="h-full text-center">
      {actionData?.link ? (
        <div className="mt-36">
          <a href={actionData.link}>I'm magic</a>
        </div>
      ) : (
        <div className="mt-36">
          <h1 className="text-3xl my-8">Remix Recipies</h1>
          <form method="post" className="flex px-8 md:w-1/2 lg:w-1/3 mx-auto">
            <EmailInput
              name="email"
              placeholder="Email"
              className="mr-4 w-3/4"
            />
            <PrimaryButton className="w-1/2 mx-auto">Log In</PrimaryButton>
          </form>
          <p className="py-8 text-red-500">
            {actionData?.error ? actionData.message : ""}
          </p>
        </div>
      )}
    </div>
  );
}
