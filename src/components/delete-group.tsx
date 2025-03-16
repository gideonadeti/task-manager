import useGroups from "@/app/groups/hooks/use-groups";
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

export default function DeleteGroup({
  open,
  onOpenChange,
  groupDeleteId,
}: {
  groupDeleteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { deleteGroupMutation } = useGroups();

  function handleDelete() {
    deleteGroupMutation.mutate({ id: groupDeleteId, onOpenChange });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => isOpen && onOpenChange(isOpen)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone, and all tasks in this group will be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteGroupMutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteGroupMutation.isPending}
            onClick={handleDelete}
          >
            {deleteGroupMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
