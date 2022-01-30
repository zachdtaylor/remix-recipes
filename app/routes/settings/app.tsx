import { ActionFunction, Form } from "remix";
import { PrimaryButton } from "~/components/forms";

export const action: ActionFunction = () => {
  return null;
};

export default function AppSettings() {
  return (
    <Form reloadDocument method="post">
      <div className="pb-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <label className="flex flex-col">
          Color Theme
          <select
            name="color-theme"
            className="p-2 mt-2 border-2 border-gray-200 rounded-md"
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
