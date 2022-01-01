import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";
import { HomeIcon, TimeIcon } from "~/components/icons";
import styles from "./tailwind.css";
import React from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => {
  return { title: "Remix Time Tracker" };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex h-screen">
          <nav className="bg-purple-900 text-white w-16">
            <AppNavLink to="/home">
              <HomeIcon />
            </AppNavLink>
            <AppNavLink to="/tracker">
              <TimeIcon />
            </AppNavLink>
          </nav>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
      </head>
      <body>
        <div className="p-4">
          <h1 className="text-2xl pb-3">
            {caught.status === 404
              ? "404 - Whoops, we couldn't find the page you're looking for."
              : `${caught.status} ${caught.statusText}`}
          </h1>
          <Link to="/" className="text-purple-800">
            Take me home
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function AppNavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={`py-4 text-center hover:bg-purple-700 ${
            isActive ? "bg-purple-700" : ""
          }`}
        >
          {children}
        </div>
      )}
    </NavLink>
  );
}
