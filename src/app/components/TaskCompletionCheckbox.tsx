import { Checkbox } from "@/components/ui/checkbox";

type TaskCompletionCheckboxProps = {
  taskId: string;
  completed: boolean;
};

export default function TaskCompletionCheckbox({
  taskId,
  completed,
}: TaskCompletionCheckboxProps) {
  function handleChange() {
    console.log(taskId);
  }

  return (
    <Checkbox
      checked={completed}
      onCheckedChange={handleChange}
      aria-label="Complete Task"
    />
  );
}
