interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: TagProps) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }: TagProps) {
  return (
    <h2
      className={`scroll-m-20 text-3xl font-semibold tracking-tight lg:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }: TagProps) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl ${className}`}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className = "" }: TagProps) {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl ${className}`}
    >
      {children}
    </h4>
  );
}

export function P({ children, className = "" }: TagProps) {
  return <p className={`leading-7 ${className}`}>{children}</p>;
}
