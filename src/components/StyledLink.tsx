import { Link } from "react-router-dom";

import { StyledLinkProps } from "../lib/types";

export function StyledLink({ to, children }: StyledLinkProps) {
  return (
    <Link
      to={to}
      className="d-flex align-items-center gap-2 hover-style px-2 py-1 rounded active-style text-reset"
    >
      {children}
    </Link>
  );
}
