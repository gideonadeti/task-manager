import { useState } from "react";

import { Sidebar } from "./Sidebar";
import { Tasks } from "./Tasks";
import { SidebarToggler } from "./SidebarToggler";

export function Main() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="position-relative">
      <Sidebar showSidebar={showSidebar} />
      <Tasks showSidebar={showSidebar} />
      <SidebarToggler onClick={() => setShowSidebar(!showSidebar)} />
    </div>
  );
}
