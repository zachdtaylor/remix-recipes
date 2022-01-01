import React from "react";
import { NavLink, Outlet } from "remix";

export default function Tracker() {
  return (
    <div className="mx-4 grow">
      <nav className="my-4 pb-2 border-b-2">
        <TrackerNavLink to="activities" className="mr-4">
          Activities
        </TrackerNavLink>
        <TrackerNavLink to="time">Time</TrackerNavLink>
      </nav>
      <Outlet />
    </div>
  );
}

function TrackerNavLink({
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
