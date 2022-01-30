import { LoaderFunction } from "remix";

export const loader: LoaderFunction = () => {
  const css = `:root { 
    --primary-color: #097969;
    --primary-color-light: #52a196;
  }`;
  return new Response(css, { headers: { "content-type": "text/css" } });
};
