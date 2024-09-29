import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { redirectTo } from "../lib/redirect-to";
import { Loading } from "../components/Loading";

export default function GoogleRedirect() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    redirectTo("/");
  }, [searchParams]);

  return <Loading />;
}
