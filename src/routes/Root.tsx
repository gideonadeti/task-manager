import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Outlet } from "react-router-dom";

import axios from "../lib/axios-instance";
import { User } from "../lib/types";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { useUserStore } from "../stores/user";

export default function Root() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useUserStore();

  useEffect(() => {
    async function getUser() {
      try {
        const { data }: { data: { user: User } } = await axios.get("/user");

        setUser(data.user);
      } catch (error) {
        console.error(error);

        if (error instanceof AxiosError && error.response?.status === 401) {
          clearUser();
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, [setUser, clearUser]);

  return (
    <div className="d-flex flex-column vh-100 overflow-y-hidden">
      <Header user={user} />
      <div className="flex-grow-1">{loading ? <Loading /> : <Outlet />}</div>
    </div>
  );
}
