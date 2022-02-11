import { Link, LoaderFunction, Outlet, useParams } from "remix";
import { requireAuthSession } from "~/utils/auth.server";
import { classNames } from "~/utils/misc";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  return null;
};

export default function MealPlan() {
  const params = useParams();
  return (
    <div className="lg:flex gap-8 w-full">
      <ul
        className={classNames("flex-auto lg:block", params.day ? "hidden" : "")}
      >
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day) => (
          <li key={day}>
            <Link to={day.toLowerCase()}>
              <div className="p-4 border-b-2 border-b-gray-200">{day}</div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex-auto">
        <Outlet />
      </div>
    </div>
  );
}
