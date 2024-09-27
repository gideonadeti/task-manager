import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/user";
import { Welcome } from "../components/Welcome";
import { useEffect } from "react";

export default function Index() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/task-groups/today");
    }
  }, [user, navigate]);

  return <Welcome />;
}
