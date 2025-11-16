"use client";

import { Checkbox } from "@/components/ui/checkbox";

type TaskSelectionCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function TaskSelectionCheckbox({
  checked,
  onCheckedChange,
}: TaskSelectionCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label="Select Task"
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default TaskSelectionCheckbox;
