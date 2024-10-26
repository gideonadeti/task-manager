interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: HeadingProps) {
  return <h1 className={`text-3xl font-bold ${className}`}>{children}</h1>;
}

export function H2({ children, className = "" }: HeadingProps) {
  return <h2 className={`text-2xl font-semibold ${className}`}>{children}</h2>;
}

export function H3({ children, className = "" }: HeadingProps) {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

export function H4({ children, className = "" }: HeadingProps) {
  return <h4 className={`text-lg font-medium ${className}`}>{children}</h4>;
}

export function H5({ children, className = "" }: HeadingProps) {
  return <h5 className={`text-base font-medium ${className}`}>{children}</h5>;
}

export function H6({ children, className = "" }: HeadingProps) {
  return <h6 className={`text-sm font-normal ${className}`}>{children}</h6>;
}
