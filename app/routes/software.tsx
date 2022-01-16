import { Outlet } from "remix";
import { PageWrapper, PageNav, PageTitle, PageContent } from "~/components/lib";

export default function Software() {
  return (
    <PageWrapper>
      <PageTitle>Software</PageTitle>
      <PageNav
        links={[
          { to: "recipies", label: "Recipies" },
          { to: "shopping-list", label: "Shopping List" },
        ]}
      />
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
