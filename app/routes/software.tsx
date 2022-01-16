import type { MetaFunction } from "remix";
import { Outlet } from "remix";
import { PageWrapper, PageNav, PageTitle, PageContent } from "~/components/lib";

export const meta: MetaFunction = () => {
  return {
    title: "Software | Remix Recipies",
  };
};

export default function Software() {
  return (
    <PageWrapper>
      <PageTitle>Software</PageTitle>
      <PageNav links={[{ to: "recipies", label: "Recipies" }]} />
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
