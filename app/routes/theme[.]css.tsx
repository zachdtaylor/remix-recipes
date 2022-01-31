import { LoaderFunction } from "remix";
import { themeStorage, getTheme } from "~/utils/theme.server";

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await themeStorage.getSession(
    request.headers.get("cookie")
  );

  const theme = getTheme(themeSession.get("theme"));

  const css = `:root {
    --primary-color: ${theme.primaryColor};
    --primary-color-light: ${theme.primaryColorLight};
  }`;
  return new Response(css, { headers: { "content-type": "text/css" } });
};
