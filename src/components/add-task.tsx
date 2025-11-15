import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Task } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import useGroups from "@/hooks/use-groups";
import useTasks from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomDialogFooter from "@/app/components/custom-dialog-footer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  dueDate: z.date().optional(),
  priority: z.string(),
  groupId: z.string(),
});

export default function AddTask({
  task,
  open,
  setOpen,
  defaultGroupId,
}: {
  task?: Task;
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultGroupId?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton preventClose>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <AddTaskForm
          task={task}
          open={open}
          setOpen={setOpen}
          defaultGroupId={defaultGroupId}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddTaskForm({
  task,
  open,
  setOpen,
  defaultGroupId,
}: {
  task?: Task;
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultGroupId?: string;
}) {
  const { groupsQuery } = useGroups();
  const { createTaskMutation, updateTaskMutation } = useTasks();
  const router = useRouter();
  const params = useParams();
  const currentGroupId = params?.groupId as string | undefined;

  const defaultDueDate = task?.dueDate ? new Date(task.dueDate) : undefined;
  const defaultTime = defaultDueDate
    ? format(defaultDueDate, "HH:mm")
    : "00:00";

  const [timeValue, setTimeValue] = useState(defaultTime);

  const defaultValues = {
    title: task?.title || "",
    dueDate: defaultDueDate,
    description: task?.description || "",
    groupId:
      task?.groupId ||
      defaultGroupId ||
      groupsQuery.data?.find((group) => group.name === "Inbox")?.id ||
      "",
    priority: task?.priority || "medium",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Reset form when defaultGroupId changes (for new tasks only)
  useEffect(() => {
    if (!task && defaultGroupId && groupsQuery.data) {
      form.setValue("groupId", defaultGroupId);
    }
  }, [defaultGroupId, groupsQuery.data, task, form]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && !task) {
      form.reset();
      setTimeValue("00:00");
    }
  }, [open, task, form]);

  // Update time value when task changes
  useEffect(() => {
    if (task?.dueDate) {
      setTimeValue(format(new Date(task.dueDate), "HH:mm"));
    } else {
      setTimeValue("00:00");
    }
  }, [task]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Combine date and time if date is set
    let combinedDueDate: Date | undefined = undefined;
    if (values.dueDate) {
      const date = new Date(values.dueDate);
      // Set time from time input, defaulting to 00:00 if not provided
      const [hours, minutes] = (timeValue || "00:00").split(":").map(Number);
      date.setHours(hours || 0, minutes || 0, 0, 0);
      combinedDueDate = date;
    }

    const submitValues = {
      ...values,
      dueDate: combinedDueDate,
    };

    if (task) {
      updateTaskMutation.mutate({
        ...submitValues,
        id: task.id,
        form,
        setOpen,
      });
    } else {
      createTaskMutation.mutate({
        ...submitValues,
        form,
        setOpen,
        router,
        currentGroupId,
        groups:
          groupsQuery.data?.map((g) => ({ id: g.id, name: g.name })) || [],
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="resize-none" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupsQuery.data?.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => {
            const handleDateSelect = (date: Date | undefined) => {
              if (date) {
                // Set time to start of day (00:00:00) when date is selected
                const newDate = new Date(date);
                newDate.setHours(0, 0, 0, 0);
                field.onChange(newDate);
                // Reset time to 00:00 when date changes
                setTimeValue("00:00");
              } else {
                field.onChange(undefined);
                setTimeValue("00:00");
              }
            };

            const handleTimeChange = (time: string) => {
              setTimeValue(time);
              // Update the date field with the new time
              if (field.value) {
                const date = new Date(field.value);
                const [hours, minutes] = time.split(":").map(Number);
                date.setHours(hours || 0, minutes || 0, 0, 0);
                field.onChange(date);
              }
            };

            const displayValue = field.value
              ? `${format(new Date(field.value), "PPP")} at ${timeValue}`
              : "Pick a due date and time";

            return (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {displayValue}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                    <Select
                      onValueChange={(value) => {
                        const date = new Date();
                        date.setDate(date.getDate() + parseInt(value, 10));
                        date.setHours(0, 0, 0, 0);
                        handleDateSelect(date);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="rounded-md border">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleDateSelect}
                      />
                    </div>
                    {field.value && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Time:</label>
                          <Input
                            type="time"
                            value={timeValue}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDateSelect(undefined)}
                          className="w-full"
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <CustomDialogFooter
          isPending={
            createTaskMutation.isPending || updateTaskMutation.isPending
          }
          disabled={!form.formState.isDirty}
          handleCancel={() => {
            setOpen(false);
            form.reset();
          }}
          handleSubmit={form.handleSubmit(onSubmit)}
        />
      </form>
    </Form>
  );
}
