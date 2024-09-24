import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Outlet } from "react-router-dom";

import axios from "../lib/axios-instance";
import { User } from "../lib/types";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { useUserStore } from "../stores/user";
import { TaskGroup } from "../lib/types";
import { useTaskGroupsStore } from "../stores/task-groups";

export default function Root() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useUserStore();
  const { setTaskGroups, clearTaskGroups } = useTaskGroupsStore();

  useEffect(() => {
    async function getUserData() {
      try {
        const { data }: { data: { user: User; taskGroups: TaskGroup[] } } =
          await axios.get("/user-data");

        setUser(data.user);
        setTaskGroups(data.taskGroups);
      } catch (error) {
        console.error(error);

        if (error instanceof AxiosError && error.response?.status === 401) {
          clearUser();
          clearTaskGroups();
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  }, [setUser, clearUser, setTaskGroups, clearTaskGroups]);

  return (
    <div className="d-flex flex-column vh-100 overflow-y-hidden">
      <Header user={user} />
      <div className="flex-grow-1">{loading ? <Loading /> : <Outlet />}</div>
    </div>
  );
}
