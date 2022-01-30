import React from "react";
import { Link, NavLink } from "remix";
import { classNames } from "~/utils/misc";
import { TimeIcon } from "./icons";

export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames("px-4 pt-8 h-full flex flex-col", className)}>
      {children}
    </div>
  );
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
  image?: string;
  isActive: boolean;
  isLoading: boolean;
};
export function RecipeCard({
  title,
  totalTime,
  image,
  isActive,
  isLoading,
}: RecipeCardProps) {
  return (
    <div
      className={classNames(
        "group",
        "flex shadow-md rounded-md border-2 border-white",
        "hover:text-primary hover:border-primary",
        isActive ? "border-primary text-primary" : "",
        isLoading ? "border-gray-500 text-gray-500" : ""
      )}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden my-4 ml-3">
        <img src={image} className="object-cover h-full w-full" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{title}</h3>
        <RecipeTime
          totalTime={totalTime}
          className={classNames(
            "group-hover:text-primary-light",
            isActive ? "text-primary-light" : "text-gray-500"
          )}
        />
      </div>
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
        "border-2 border-red-600",
        "hover:bg-red-600 hover:text-white",
        props.disabled ? "bg-red-600 text-white" : "text-red-600",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "text-white bg-primary hover:bg-primary-light",
        props.disabled ? "bg-primary-light" : "",
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
