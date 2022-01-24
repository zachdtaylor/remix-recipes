import React from "react";
import { Link, NavLink } from "remix";
import { classNames } from "~/utils/misc";
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
        classNames(
          "pb-2.5 px-2",
          isActive ? " border-b-2 border-b-primary" : "",
          className
        )
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

type RecipeCardProps = {
  title: string;
  totalTime: string;
  isActive: boolean;
  isLoading: boolean;
};
export function RecipeCard({
  title,
  totalTime,
  isActive,
  isLoading,
}: RecipeCardProps) {
  return (
    <div
      className={classNames(
        "group",
        "p-4 shadow-md rounded-md border-2 border-white",
        "hover:text-primary hover:border-primary",
        isActive ? "border-primary text-primary" : "",
        isLoading ? "border-gray-500 text-gray-500" : ""
      )}
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      <RecipeTime
        totalTime={totalTime}
        className={classNames(
          "group-hover:text-primary-light",
          isActive ? "text-primary-light" : "text-gray-500"
        )}
      />
    </div>
  );
}

type RecipeTimeProps = {
  totalTime: string;
  className?: string;
};
export function RecipeTime({ totalTime, className }: RecipeTimeProps) {
  return (
    <div className={classNames("flex font-light", className)}>
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
    <div
      className={classNames(
        "text-white bg-red-400 rounded-md text-center",
        "h-full border-red-600 border-8 flex flex-col justify-center py-8"
      )}
    >
      <h1 className="text-2xl mb-4">{title}</h1>
      <p>{message}</p>
    </div>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "submit" | "button" | "reset";
  name?: string;
  value?: string;
  disabled?: boolean;
};
function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames("px-3 py-2 rounded-md text-center", className)}
    >
      {children}
    </button>
  );
}

export function DeleteButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "border-2 text-red-600 border-red-600",
        "hover:bg-red-600 hover:text-white",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function PrimaryButton({
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "text-white bg-primary hover:bg-primary-light",
        disabled ? "bg-primary-light" : "",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "border-2 border-primary text-primary px-3 py-2 cursor-pointer",
        "hover:bg-primary hover:text-white rounded-md"
      )}
    >
      {children}
    </Button>
  );
}

export function LinkButton({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link to={to} className="bg-primary text-white px-3 py-2 rounded-md">
      {children}
    </Link>
  );
}
