"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BulkPriorityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPriority: (priority: string) => void;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function BulkPriorityDialog({
  open,
  onOpenChange,
  onSelectPriority,
}: BulkPriorityDialogProps) {
  const handleSelect = (priority: string) => {
    onSelectPriority(priority);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Priority</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleSelect(option.value)}
            >
              <Badge
                variant="outline"
                className={`${
                  option.value === "high"
                    ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                    : option.value === "medium"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                    : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                }`}
              >
                {option.label}
              </Badge>
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
