interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: HeadingProps) {
  return <h1 className={`text-5xl font-bold ${className}`}>{children}</h1>;
}

export function H2({ children, className = "" }: HeadingProps) {
  return <h2 className={`text-4xl font-bold ${className}`}>{children}</h2>;
}

export function H3({ children, className = "" }: HeadingProps) {
  return <h3 className={`text-3xl font-bold ${className}`}>{children}</h3>;
}

export function H4({ children, className = "" }: HeadingProps) {
  return <h4 className={`text-2xl font-bold ${className}`}>{children}</h4>;
}

export function H5({ children, className = "" }: HeadingProps) {
  return <h5 className={`text-xl font-bold ${className}`}>{children}</h5>;
}

export function H6({ children, className = "" }: HeadingProps) {
  return <h6 className={`text-lg font-bold ${className}`}>{children}</h6>;
}
