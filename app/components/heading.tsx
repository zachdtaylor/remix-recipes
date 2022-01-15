type HeadingPropTypes = {
  children: string;
};

export function Heading1({ children }: HeadingPropTypes) {
  return <h1 className="text-2xl font-extrabold mb-2">{children}</h1>;
}

export function Heading2({ children }: HeadingPropTypes) {
  return <h2 className="text-xl font-bold mb-2">{children}</h2>;
}
