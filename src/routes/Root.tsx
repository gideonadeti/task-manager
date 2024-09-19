// import { useEffect, useState } from "react";
// import { AxiosError } from "axios";

// import axios from "../lib/axios-instance";
// import { User } from "../lib/types";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
// import { Welcome } from "../components/Welcome";
// import { Loading } from "../components/Loading";

export default function Root() {
  // const [loading, setLoading] = useState(true);
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   async function getUser() {
  //     try {
  //       const { data }: { data: { user: User } } = await axios.get("/user");

  //       setUser(data.user);
  //     } catch (error) {
  //       console.error(error);

  //       if (error instanceof AxiosError && error.response?.status === 401) {
  //         setUser(null);
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("refreshToken");
  //       }
  //     } finally {
  //       // setLoading(false);
  //     }
  //   }
  //   getUser();
  // }, []);

  return (
    <div className="d-flex flex-column vh-100 overflow-y-hidden">
      <Header user={null} />
      <div className="flex-grow-1">
        <Main />
      </div>
    </div>
  );
}
