import type { LoaderFunction, MetaFunction } from "remix";
import { Outlet } from "remix";
import { PageWrapper, PageNav, PageTitle, PageContent } from "~/components/lib";
import { requireAuthSession } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return {
    title: "Software | Remix Recipes",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);
  return null;
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
