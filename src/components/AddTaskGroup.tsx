import { ClickableElement } from "./ClickableElement";

export function AddTaskGroup() {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <h5>My Task Groups</h5>
      <ClickableElement>
        <i className="bi-plus"></i>
      </ClickableElement>
    </div>
  );
}
