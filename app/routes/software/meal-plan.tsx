import { LoaderFunction } from "remix";
import { requireAuthSession } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  return null;
};

export default function MealPlan() {
  return (
    <div className="flex">
      <div>
        <div>Sunday</div>
        <div>Monday</div>
        <div>Tuesday</div>
        <div>Wednesday</div>
        <div>Thursday</div>
        <div>Friday</div>
        <div>Saturday</div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
}
