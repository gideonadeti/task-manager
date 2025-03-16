import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { Group } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGroup, updateGroup } from "@/app/query-functions";
import { useToast } from "@/hooks/use-toast";
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

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function AddGroup({
  open,
  onOpenChange,
  defaultValue,
  groupUpdateId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue: string;
  groupUpdateId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValue ? "Update Group" : "Add Group"}
          </DialogTitle>
        </DialogHeader>
        <AddGroupForm
          defaultValue={defaultValue}
          groupUpdateId={groupUpdateId}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddGroupForm({
  defaultValue,
  groupUpdateId,
  onOpenChange,
}: {
  defaultValue: string;
  groupUpdateId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: defaultValue || "" },
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation<Group, AxiosError, { name: string }>({
    mutationFn: ({ name }: { name: string }) => {
      if (defaultValue) {
        return updateGroup(user!.id, groupUpdateId, name);
      } else {
        return createGroup(name, user!.id);
      }
    },
    onSuccess: (group) => {
      queryClient.setQueryData<Group[]>(["groups"], (prevGroups) => {
        const groupsArray = Array.isArray(prevGroups) ? prevGroups : [];

        return [...groupsArray, group];
      });

      form.reset();

      toast({
        description: "Group added successfully",
        variant: "success",
      });
      onOpenChange(false);

      router.push(`/groups/${group.id}`);
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={status === "pending"}>
          {status === "pending"
            ? "Submitting"
            : defaultValue
            ? "Update"
            : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
