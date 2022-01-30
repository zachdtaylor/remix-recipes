import { json, LoaderFunction } from "remix";
import { LinkButton } from "~/components/forms";
import { authSession } from "~/utils/auth.server";

export const loader: LoaderFunction = async () => {
  const session = await authSession.getSession();
  return json("ok", {
    headers: {
      "Set-Cookie": await authSession.destroySession(session),
    },
  });
};

export default function Logout() {
  return (
    <div className="text-center">
      <div className="mt-24">
        <h1 className="text-2xl">You're good to go 👍</h1>
        <p className="py-8">Logout successful</p>
        <LinkButton to="/">Take me home</LinkButton>
      </div>
    </div>
  );
}
