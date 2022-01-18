import type { MetaFunction } from "remix";
import { Outlet } from "remix";
import { PageWrapper, PageNav, PageTitle, PageContent } from "~/components/lib";

export const meta: MetaFunction = () => {
  return {
    title: "Software | Remix Recipes",
  };
};

export default function Software() {
  return (
    <PageWrapper>
      <PageTitle>Software</PageTitle>
      <PageNav links={[{ to: "recipes", label: "Recipes" }]} />
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
