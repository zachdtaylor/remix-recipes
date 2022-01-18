import type { MetaFunction } from "remix";
import { PageWrapper, PageTitle } from "~/components/lib";

export const meta: MetaFunction = () => {
  return {
    title: "Home | Remix Recipes",
    description: "Come find some good recipes!",
  };
};

export default function Home() {
  return (
    <PageWrapper>
      <PageTitle>Home</PageTitle>
      <h1 className="my-4 text-2xl">Welcome to the Remix Recipe App 😁</h1>
    </PageWrapper>
  );
}
