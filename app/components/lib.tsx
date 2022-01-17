import React from "react";
import { NavLink } from "remix";
import { TimeIcon } from "./icons";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pt-8 h-full flex flex-col">{children}</div>;
}

type PageTitleProps = {
  children: string;
};

export function PageTitle({ children }: PageTitleProps) {
  return <h1 className="text-2xl font-bold mb-4">{children}</h1>;
}

function PageNavLink({
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
        (isActive ? " border-b-2 border-b-primary" : "") +
        " pb-2.5 px-2"
      }
    >
      {children}
    </NavLink>
  );
}

type PageNavProps = {
  links: Array<{ to: string; label: string }>;
};

export function PageNav({ links }: PageNavProps) {
  return (
    <nav className="mt-4 pb-2 border-b-2">
      {links.map((link) => (
        <PageNavLink key={link.to} to={link.to}>
          {link.label}
        </PageNavLink>
      ))}
    </nav>
  );
}

export function PageContent({ children }: { children: React.ReactNode }) {
  return <div className="py-8 flex-grow overflow-auto">{children}</div>;
}

type RecipieCardProps = {
  title: string;
  totalTime: string;
};
export function RecipieCard({ title, totalTime }: RecipieCardProps) {
  return (
    <div className="p-4 shadow-md">
      <h3 className="font-semibold mb-1">{title}</h3>
      <RecipieTime totalTime={totalTime} />
    </div>
  );
}

export function RecipieTime({ totalTime }: { totalTime: string }) {
  return (
    <div className="flex font-light text-gray-500">
      <TimeIcon />
      <p className="ml-1">{totalTime}</p>
    </div>
  );
}

export function ErrorSection({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="text-white bg-red-400 rounded-md text-center h-full border-red-600 border-8 flex flex-col justify-center">
      <h1 className="text-2xl mb-4">{title}</h1>
      <p>{message}</p>
    </div>
  );
}
