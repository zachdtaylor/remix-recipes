import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import { requireAuthSession } from "~/utils/auth.server";
import * as MealPlanController from "~/controllers/meal-plan-controller.server";
import { capitalize } from "~/utils/misc";
import {
  CheckButton,
  PrimaryButton,
  SecondaryButton,
} from "~/components/forms";
import { getStringValue } from "~/utils/http";

type LoaderData = {
  shoppingList: Awaited<ReturnType<typeof MealPlanController.getShoppingList>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  return { shoppingList: await MealPlanController.getShoppingList(userId) };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await requireAuthSession(request);
  const userId = session.get("userId");
  const formData = await request.formData();
  return MealPlanController.addItemToPantry(userId, formData.get("name"));
};

export default function ShoppingList() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1 className="py-4 text-center uppercase font-bold tracking-wide">
        Shopping List
      </h1>
      <ul>
        {data.shoppingList.map((item) => (
          <li key={item.name} className="py-2">
            <div className="flex">
              <span className="flex flex-col justify-center uppercase tracking-wider">
                {item.name}
              </span>
              <Form reloadDocument method="post">
                <input type="hidden" name="name" value={item.name} />
                <CheckButton />
              </Form>
            </div>
            <ul className="pl-4 pt-2">
              {item.through.map((owner, index) => (
                <li key={index} className="pb-1">
                  {owner.amount} for {owner.recipe.name} on{" "}
                  {capitalize(owner.day)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
