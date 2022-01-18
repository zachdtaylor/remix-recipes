import { classNames } from "~/utils/misc";

type HeadingPropTypes = {
  children: string;
  className?: string;
};

export function Heading1({ children, className }: HeadingPropTypes) {
  return (
    <h1 className={classNames("text-2xl font-extrabold mb-2", className)}>
      {children}
    </h1>
  );
}

export function Heading2({ children, className }: HeadingPropTypes) {
  return (
    <h2 className={classNames("text-xl font-bold", className)}>{children}</h2>
  );
}
