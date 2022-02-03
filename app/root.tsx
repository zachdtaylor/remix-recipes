import {
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
import {
  BookIcon,
  HomeIcon,
  LoginIcon,
  LogoutIcon,
  SettingsIcon,
} from "~/components/icons";
import tailwindStyles from "./tailwind.css";
import React from "react";
import { getSessionUserId } from "./utils/auth.server";
import { LinkButton } from "./components/forms";
import { useShouldHydrate } from "./utils/misc";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "/theme.css" },
    { rel: "stylesheet", href: tailwindStyles },
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
  const shouldHydrate = useShouldHydrate();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="text-gray-800">
        <div className="md:flex md:h-screen md:basis-full">
          <nav className="flex justify-between shrink-0 w-full bg-primary text-white md:flex-col md:w-16">
            <ul className="flex md:flex-col">
              <AppNavLink to="/discover">
                <HomeIcon />
              </AppNavLink>
              {userId ? (
                <AppNavLink to="/software">
                  <BookIcon />
                </AppNavLink>
              ) : null}
              <AppNavLink to="/settings">
                <SettingsIcon />
              </AppNavLink>
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
          <div className="flex-grow md:w-[calc(100%-4rem)]">
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        {shouldHydrate ? <Scripts /> : null}
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
          <LinkButton to="/">Take me home</LinkButton>
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
          <LinkButton to="/">Take me home</LinkButton>
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
      <NavLink to={to} className="w-16" reloadDocument>
        {({ isActive }) => (
          <div
            className={`py-4 text-center hover:bg-primary-light ${
              isActive ? "bg-primary-light" : ""
            }`}
          >
            {children}
          </div>
        )}
      </NavLink>
    </li>
  );
}
