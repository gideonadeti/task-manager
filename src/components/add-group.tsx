import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Group } from "@prisma/client";

import useGroups from "@/hooks/use-groups";
import CustomDialogFooter from "@/app/components/custom-dialog-footer";
import { createGroupSchema } from "@/lib/validations";
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
}

const AddGroup = ({ open, group, onOpenChange }: AddGroupProps) => {
  const { createGroupMutation, updateGroupMutation } = useGroups();
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
      createGroupMutation.mutate({ name: formValues.name, onOpenChange });
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
          <DialogTitle>{group ? "Update Group" : "Add Group"}</DialogTitle>
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
                createGroupMutation.isPending || updateGroupMutation.isPending
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
