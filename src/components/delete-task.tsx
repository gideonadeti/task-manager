import useTasks from "@/app/groups/hooks/use-tasks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteTaskMutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteTaskMutation.isPending}
            onClick={handleDelete}
          >
            {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
