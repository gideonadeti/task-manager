import useGroups from "@/hooks/use-groups";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomDialogFooter from "@/app/components/custom-dialog-footer";

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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone, and all tasks in this group will be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <CustomDialogFooter
          variant="alert"
          isPending={deleteGroupMutation.isPending}
          submitText="Delete"
          handleCancel={() => onOpenChange(false)}
          handleSubmit={handleDelete}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
