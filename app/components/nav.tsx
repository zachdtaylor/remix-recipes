import { NavLink } from "remix";

type PageTitleProps = {
  children: string;
};

export function PageTitle({ children }: PageTitleProps) {
  return <h1 className="text-2xl font-bold my-8">{children}</h1>;
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
    <nav className="my-4 pb-2 border-b-2">
      {links.map((link) => (
        <PageNavLink key={link.to} to={link.to}>
          {link.label}
        </PageNavLink>
      ))}
    </nav>
  );
}
