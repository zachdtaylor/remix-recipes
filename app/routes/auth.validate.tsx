import { useLoaderData } from "remix";

export { validateLoader as loader } from "~/utils/auth.server";

export default function Validate() {
  const data = useLoaderData();
  return (
    <div className="h-full text-center">
      <div className="mt-36">The email you entered was {data.email}</div>
    </div>
  );
}
