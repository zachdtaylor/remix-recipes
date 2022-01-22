import {
  LoaderFunction,
  useActionData,
  json,
  ActionFunction,
  redirect,
} from "remix";
import { TextInput } from "~/components/forms";
import { PrimaryButton } from "~/components/lib";
import { authSession, getMagicLinkPayload } from "~/utils/auth.server";
import { classNames } from "~/utils/misc";
import * as User from "~/model/user";

export const loader: LoaderFunction = async ({ request }) => {
  const magicLinkPayload = getMagicLinkPayload(request);
  const user = await User.getUserByEmail(magicLinkPayload.email);

  // Still need to sign up, so just return ok
  if (!user) {
    return json("ok");
  }

  const cookie = request.headers.get("cookie");
  const session = await authSession.getSession(cookie);
  session.set("userId", user.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await authSession.commitSession(session),
    },
  });
};

export const action: ActionFunction = async ({ request }) => {
  const magicLinkPayload = getMagicLinkPayload(request);

  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  if (typeof firstName !== "string" || firstName.length === 0) {
    return json(
      { error: "invalid first name", message: "Please provide a first name" },
      { status: 400 }
    );
  }

  if (typeof lastName !== "string" || lastName.length === 0) {
    return json(
      { error: "invalid last name", message: "Please provide a last name" },
      { status: 400 }
    );
  }

  // Magic link is valid and form is good, so create the user.
  const user = await User.createUser({
    email: magicLinkPayload.email,
    firstName,
    lastName,
  });

  const cookie = request.headers.get("cookie");
  const session = await authSession.getSession(cookie);
  session.set("userId", user.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await authSession.commitSession(session),
    },
  });
};

export default function Validate() {
  const actionData = useActionData();
  return (
    <div className="text-center">
      <div className="mt-24">
        <h1 className="text-2xl my-8">You're almost done!</h1>
        <h2>Type in your name below to complete the signup process.</h2>
        <form
          method="post"
          className={classNames(
            "flex flex-col px-8 mx-16 md:mx-auto",
            "border-2 border-gray-200 rounded-md p-8 mt-8 md:w-80"
          )}
        >
          <fieldset className="mb-8 flex flex-col">
            <TextInput
              showBorder
              required
              name="firstName"
              placeholder="First Name"
              className="mb-8"
            />
            <TextInput
              showBorder
              required
              name="lastName"
              placeholder="Last Name"
            />
          </fieldset>
          <p
            className={classNames(
              "text-red-500",
              actionData?.error ? "mb-8" : ""
            )}
          >
            {actionData?.error ? actionData.message : ""}
          </p>
          <PrimaryButton className="w-36 mx-auto">Log In</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
