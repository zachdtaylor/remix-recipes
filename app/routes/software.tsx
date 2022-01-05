import React from "react";
import { NavLink, Outlet } from "remix";

export default function Software() {
  return (
    <div className="mx-4 grow">
      <nav className="my-4 pb-2 border-b-2">
        <SoftwareNavLink to="recipies" className="mr-4">
          Recipies
        </SoftwareNavLink>
        <SoftwareNavLink to="shopping-list">Shopping List</SoftwareNavLink>
      </nav>
      <Outlet />
    </div>
  );
}

function SoftwareNavLink({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        (className || "") +
        (isActive ? " border-b-2 border-b-purple-800" : "") +
        " pb-2.5"
      }
    >
      {children}
    </NavLink>
  );
}
