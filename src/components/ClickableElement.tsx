import { ClickableElementProps } from "../lib/types";

export function ClickableElement({
  className,
  children,
}: ClickableElementProps) {
  return (
    <div
      className={`d-flex align-items-center gap-2 hover-style px-2 py-1 rounded active-style ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}
