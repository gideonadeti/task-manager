import { Sidebar } from "./Sidebar";
import { Tasks } from "./Tasks";

export function Main() {
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <Tasks />
    </div>
  );
}
