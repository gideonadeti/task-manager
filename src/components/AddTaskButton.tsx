import { ClickableElement } from "./ClickableElement";

export function AddTaskButton() {
  return (
    <ClickableElement>
      <i className="bi-plus-circle-fill"></i>
      <p>Add task</p>
    </ClickableElement>
  );
}
