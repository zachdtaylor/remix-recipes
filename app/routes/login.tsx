import {
  ActionFunction,
  LoaderFunction,
  redirect,
  json,
  useActionData,
} from "remix";
import { EmailInput } from "~/components/forms";
import { PrimaryButton } from "~/components/lib";
import { getSessionUserId, sendMagicLinkEmail } from "~/utils/auth.server";
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

  const email = formData.get("email");
  if (typeof email !== "string" || !isValidEmail(email)) {
    return json(
      { error: "invalid email", message: "Please provide a valid email" },
      { status: 400 }
    );
  }

  await sendMagicLinkEmail(email);

  return json({ ok: true });
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div className="text-center">
      {actionData?.ok ? (
        <div className="mt-36 mx-4">
          <h1 className="text-2xl py-8">Yum! 🍲</h1>
          <p>Check your email and click the link to finish logging in.</p>
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
