import React from "react";
import { NavLink, Outlet } from "remix";
import { PageNav, PageTitle } from "~/components/nav";

export default function Software() {
  return (
    <div className="mx-4">
      <PageTitle>Software</PageTitle>
      <PageNav
        links={[
          { to: "recipies", label: "Recipies" },
          { to: "shopping-list", label: "Shopping List" },
        ]}
      />
      <div className="my-8">
        <Outlet />
      </div>
    </div>
  );
}
