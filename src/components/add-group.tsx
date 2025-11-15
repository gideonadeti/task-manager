import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import useGroups from "@/hooks/use-groups";
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
import CustomDialogFooter from "@/app/components/custom-dialog-footer";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

const AddGroup = ({
  open,
  onOpenChange,
  defaultValue,
  groupUpdateId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue: string;
  groupUpdateId: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton preventClose>
        <DialogHeader>
          <DialogTitle>
            {defaultValue ? "Update Group" : "Add Group"}
          </DialogTitle>
        </DialogHeader>
        <AddGroupForm
          defaultValue={defaultValue}
          groupUpdateId={groupUpdateId}
          open={open}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};

function AddGroupForm({
  defaultValue,
  groupUpdateId,
  open,
  onOpenChange,
}: {
  defaultValue: string;
  groupUpdateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: defaultValue || "" },
  });
  const router = useRouter();
  const params = useParams();

  const { createGroupMutation, updateGroupMutation } = useGroups();

  // Reset form when dialog closes (for new groups only)
  useEffect(() => {
    if (!open && !defaultValue) {
      form.reset();
    }
  }, [open, defaultValue, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (defaultValue) {
      updateGroupMutation.mutate({
        ...values,
        id: groupUpdateId,
        form,
        router,
        open: groupUpdateId !== params.groupId, // Navigation will take place if the group is different from the current one and the navigation will automatically close the dialog so keep it open initially else it'll kinda open and close
        onOpenChange,
      });
    } else {
      createGroupMutation.mutate({ ...values, form, router });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  );
}

export default AddGroup;
