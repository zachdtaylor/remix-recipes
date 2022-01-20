import { EmailInput } from "~/components/forms";
import { PrimaryButton } from "~/components/lib";

export default function Login() {
  return (
    <div className="h-full text-center flex flex-col">
      <div className="mt-36">
        <h1 className="text-3xl my-8">Remix Recipies</h1>
        <form method="post" className="flex w-1/3 mx-auto">
          <EmailInput name="email" placeholder="Email" className="mr-4 w-3/4" />
          <PrimaryButton className="w-1/2 mx-auto">Log In</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
