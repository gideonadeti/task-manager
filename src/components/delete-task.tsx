import useTasks from "@/hooks/use-tasks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomDialogFooter from "@/app/components/custom-dialog-footer";

export default function DeleteTask({
  open,
  onOpenChange,
  taskDeleteId,
}: {
  taskDeleteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { deleteTaskMutation } = useTasks();

  function handleDelete() {
    deleteTaskMutation.mutate({ id: taskDeleteId, onOpenChange });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => isOpen && onOpenChange(isOpen)}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <CustomDialogFooter
          variant="alert"
          isPending={deleteTaskMutation.isPending}
          submitText="Delete"
          handleCancel={() => onOpenChange(false)}
          handleSubmit={handleDelete}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
