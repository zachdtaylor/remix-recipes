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
  useLoaderData,
} from "remix";
import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { BookIcon, HomeIcon, LoginIcon, LogoutIcon } from "~/components/icons";
import tailwindStyles from "./tailwind.css";
import theme from "./styles/theme.css";
import sharedStyles from "./styles/shared.css";
import styles from "./styles/root.css";
import React from "react";
import { getSessionUserId } from "./utils/auth.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: theme },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "stylesheet", href: sharedStyles },
  ];
};

export const meta: MetaFunction = () => {
  return { title: "Remix Recipes" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getSessionUserId(request);
  return userId;
};

export default function App() {
  const userId = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="text-gray-800">
        <div className="root-container md:flex md:h-screen">
          <nav className="flex justify-between shrink-0 w-full md:flex-col md:w-16">
            <ul className="flex md:flex-col">
              <AppNavLink to="/home">
                <HomeIcon />
              </AppNavLink>
              {userId ? (
                <AppNavLink to="/software">
                  <BookIcon />
                </AppNavLink>
              ) : null}
            </ul>
            <ul>
              {!userId ? (
                <AppNavLink to="/login">
                  <LoginIcon />
                </AppNavLink>
              ) : (
                <AppNavLink to="/logout">
                  <LogoutIcon />
                </AppNavLink>
              )}
            </ul>
          </nav>
          <div className="flex-grow">
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        {/* <Scripts /> */}
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        <div className="p-4">
          <h1 className="text-2xl pb-3">
            {caught.status} {caught.statusText}
          </h1>
          <p className="mb-4">{caught.data?.message}</p>
          <Link to="/" className="bg-primary text-white px-3 py-2 rounded-md">
            Take me home
          </Link>
        </div>
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <html>
      <head>
        <title>Oops!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        <div className="p-4">
          <h1 className="text-2xl pb-3">An unexpected error occurred</h1>
          <p className="mb-4">{error.message}</p>
          <Link to="/" className="bg-primary text-white px-3 py-2 rounded-md">
            Take me home
          </Link>
        </div>
      </body>
    </html>
  );
};

function AppNavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <li className="w-16">
      <NavLink to={to} className="w-16">
        {({ isActive }) => (
          <div className={`app-nav-link ${isActive ? "-active" : ""}`}>
            {children}
          </div>
        )}
      </NavLink>
    </li>
  );
}
