import { useRouteError } from "react-router-dom";

import { ErrorPageProps } from "../lib/types";

export default function ErrorPage() {
  const error = useRouteError() as ErrorPageProps;
  console.error(error);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  );
}
