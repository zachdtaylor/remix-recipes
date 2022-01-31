import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import { PrimaryButton } from "~/components/forms";
import { parseStringFormData } from "~/utils/http";
import { themeStorage } from "~/utils/theme.server";

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await themeStorage.getSession(
    request.headers.get("cookie")
  );

  const theme = themeSession.get("theme");

  return { theme };
};

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await themeStorage.getSession(
    request.headers.get("cookie")
  );
  const formData = await parseStringFormData(request);
  const theme = formData["colorTheme"];
  themeSession.set("theme", theme);

  return json(
    { success: true, theme },
    {
      headers: {
        "Set-Cookie": await themeStorage.commitSession(themeSession),
      },
    }
  );
};

export default function AppSettings() {
  const data = useLoaderData();
  const actionData = useActionData();
  return (
    <Form reloadDocument method="post">
      <div className="pb-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <label className="flex flex-col">
          Color Theme
          <select
            name="colorTheme"
            className="p-2 mt-2 border-2 border-gray-200 rounded-md"
            defaultValue={actionData?.theme || data.theme}
          >
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
          </select>
        </label>
      </div>
      <PrimaryButton>Save</PrimaryButton>
    </Form>
  );
}
