import { LoaderFunction, useActionData, json, ActionFunction } from "remix";
import { TextInput } from "~/components/forms";
import { PrimaryButton } from "~/components/lib";
import { getMagicLinkPayload } from "~/utils/auth.server";
import { classNames } from "~/utils/misc";

export const loader: LoaderFunction = async ({ request }) => {
  const magicLinkPayload = getMagicLinkPayload(request);

  return json(magicLinkPayload);
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

  return null;
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
