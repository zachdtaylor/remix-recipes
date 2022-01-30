import { LoaderFunction, Outlet } from "remix";
import { PageContent, PageNav, PageTitle, PageWrapper } from "~/components/lib";

export const loader: LoaderFunction = () => {
  return null;
};

export default function Settings() {
  return (
    <PageWrapper>
      <PageTitle>Settings</PageTitle>
      <PageNav links={[{ to: "app", label: "App" }]} />
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
