import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGroup } from "@/app/query-functions";
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
  name: z.string(),
});

export default function AddGroup({
  open,
  onOpenChange,
  defaultValue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
        </DialogHeader>
        <AddGroupForm defaultValue={defaultValue} />
      </DialogContent>
    </Dialog>
  );
}

function AddGroupForm({ defaultValue }: { defaultValue: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: defaultValue },
  });
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation({
    mutationFn: ({ name }: { name: string }) => createGroup(name, user!.id),
    onSuccess: (message) => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      form.reset({ name: "" });

      toast({
        description: message,
        variant: "success",
      });
    },
    onError: (error) => {
      console.error(error);

      toast({
        variant: "destructive",
        description: error.message,
      });
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
          {status === "pending" ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
