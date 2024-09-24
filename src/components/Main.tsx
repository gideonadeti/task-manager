import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Tasks } from "./Tasks";
import { SidebarToggler } from "./SidebarToggler";
import { useUserStore } from "../stores/user";

export function Main() {
  const [showSidebar, setShowSidebar] = useState(true);

  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/sign-in");
    }
  }, [user, navigate]);

  return (
    <div className="position-relative">
      <Sidebar showSidebar={showSidebar} />
      <Tasks showSidebar={showSidebar} />
      <SidebarToggler onClick={() => setShowSidebar(!showSidebar)} />
    </div>
  );
}
