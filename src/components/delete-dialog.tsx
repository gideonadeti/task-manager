import useTasks from "@/hooks/use-tasks";
import useGroups from "@/hooks/use-groups";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomDialogFooter from "@/app/components/custom-dialog-footer";

interface DeleteDialogProps {
  type: "task" | "group";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteId: string;
}

export default function DeleteDialog({
  type,
  open,
  onOpenChange,
  deleteId,
}: DeleteDialogProps) {
  const { deleteTaskMutation } = useTasks();
  const { deleteGroupMutation } = useGroups();

  const isTask = type === "task";
  const mutation = isTask ? deleteTaskMutation : deleteGroupMutation;
  const title = isTask
    ? "Are you sure you want to delete this task?"
    : "Are you sure you want to delete this group?";
  const description = isTask
    ? "This action cannot be undone."
    : "This action cannot be undone, and all tasks in this group will be deleted.";

  function handleDelete() {
    mutation.mutate({ id: deleteId, onOpenChange });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => isOpen && onOpenChange(isOpen)}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <CustomDialogFooter
          variant="alert"
          isPending={mutation.isPending}
          submitText="Delete"
          handleCancel={() => onOpenChange(false)}
          handleSubmit={handleDelete}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

