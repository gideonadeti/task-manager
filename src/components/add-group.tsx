import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Group } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import useGroups from "@/hooks/use-groups";
import CustomDialogFooter from "@/app/components/custom-dialog-footer";
import { createGroupSchema } from "@/lib/validations";
import { createGroup } from "@/lib/api/query-functions";
import { handleApiError } from "@/lib/api/error-handler";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AddGroupProps {
  open: boolean;
  group?: Group;
  onOpenChange: (open: boolean) => void;
  onGroupCreated?: (groupId: string) => void;
}

const AddGroup = ({ open, group, onOpenChange, onGroupCreated }: AddGroupProps) => {
  const { createGroupMutation, updateGroupMutation } = useGroups();
  const queryClient = useQueryClient();
  
  // Custom mutation for when onGroupCreated callback is provided (no redirect)
  const customCreateGroupMutation = useMutation<
    Group,
    AxiosError,
    { name: string }
  >({
    mutationFn: ({ name }) => createGroup(name),
    onError: (err) => {
      handleApiError(err);
    },
    onSuccess: (createdGroup) => {
      onOpenChange(false);
      toast.success("Group created successfully");
      // Update the groups cache
      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        return [createdGroup, ...(prevGroups || [])];
      });
      // Call the custom callback if provided
      if (onGroupCreated) {
        onGroupCreated(createdGroup.id);
      }
    },
  });

  // Use custom mutation if callback is provided, otherwise use default
  const activeCreateMutation = onGroupCreated 
    ? customCreateGroupMutation 
    : createGroupMutation;

  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when dialog opens or group changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: group?.name || "",
      });
    }
  }, [open, group, form]);

  const onSubmit = (formValues: z.infer<typeof createGroupSchema>) => {
    if (group) {
      updateGroupMutation.mutate({
        id: group.id,
        name: formValues.name,
        onOpenChange,
      });
    } else {
      if (onGroupCreated) {
        customCreateGroupMutation.mutate({ name: formValues.name });
      } else {
        createGroupMutation.mutate({ name: formValues.name, onOpenChange });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[425px]"
        hideCloseButton
        preventClose
      >
        <DialogHeader>
          <DialogTitle>{group ? "Edit Group" : "Add Group"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomDialogFooter
              isPending={
                activeCreateMutation.isPending || updateGroupMutation.isPending
              }
              disabled={!form.formState.isDirty}
              handleCancel={() => {
                onOpenChange(false);
                form.reset();
              }}
              handleSubmit={form.handleSubmit(onSubmit)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroup;
