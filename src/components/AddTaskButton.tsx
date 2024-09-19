import { ClickableElement } from "./ClickableElement";

export function AddTaskButton({ className }: { className?: string }) {
  return (
    <ClickableElement className={className}>
      <i className="bi-plus-circle-fill"></i>
      <p>Add task</p>
    </ClickableElement>
  );
}
