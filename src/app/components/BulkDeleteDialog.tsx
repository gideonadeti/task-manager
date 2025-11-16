"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomDialogFooter from "./custom-dialog-footer";

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskCount: number;
  isPending?: boolean;
}

export default function BulkDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  taskCount,
  isPending = false,
}: BulkDeleteDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => isOpen && onOpenChange(isOpen)}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {taskCount} {taskCount === 1 ? "task" : "tasks"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All selected tasks will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <CustomDialogFooter
          variant="alert"
          isPending={isPending}
          submitText="Delete"
          handleCancel={() => onOpenChange(false)}
          handleSubmit={onConfirm}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

