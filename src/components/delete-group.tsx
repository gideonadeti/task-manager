import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

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
import { useToast } from "@/hooks/use-toast";
import { deleteGroup } from "@/app/query-functions";

export default function DeleteGroup({
  open,
  onOpenChange,
  groupDeleteId,
}: {
  groupDeleteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, status } = useMutation({
    mutationFn: (groupDeleteId: string) => deleteGroup(groupDeleteId),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      toast({
        description: message,
        variant: "success",
      });
      onOpenChange(false); // Close dialog after success
    },
    onError: (error) => {
      console.error(error);

      if (error instanceof AxiosError && error.response) {
        const errorMessage = (error.response.data as { error: string }).error;

        toast({
          description: errorMessage || "Something went wrong",
          variant: "destructive",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      }
    },
  });

  function handleDelete() {
    mutate(groupDeleteId);
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
            disabled={status === "pending"}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={status === "pending"}
            onClick={handleDelete}
          >
            {status === "pending" ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
