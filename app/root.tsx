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
  ErrorBoundaryComponent,
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";
import { BookIcon, HomeIcon } from "~/components/icons";
import tailwindStyles from "./tailwind.css";
import theme from "./styles/theme.css";
import sharedStyles from "./styles/shared.css";
import styles from "./styles/root.css";
import React from "react";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: theme },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "stylesheet", href: sharedStyles },
  ];
};

export const meta: MetaFunction = () => {
  return { title: "Remix Recipies" };
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
        <div className="root-container">
          <nav>
            <AppNavLink to="/home">
              <HomeIcon />
            </AppNavLink>
            <AppNavLink to="/software">
              <BookIcon />
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
          <Link to="/" className="text-primary">
            Take me home
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <div>{error.message}</div>;
};

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
        <div className={`app-nav-link ${isActive ? "-active" : ""}`}>
          {children}
        </div>
      )}
    </NavLink>
  );
}
