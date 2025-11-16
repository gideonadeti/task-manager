import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Task } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import useGroups from "@/hooks/use-groups";
import useTasks from "@/hooks/use-tasks";
import AddGroup from "./add-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <DialogContent
        className="max-w-[95vw] sm:max-w-[425px] max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0"
        hideCloseButton
        preventClose
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
          <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <AddTaskForm
            task={task}
            open={open}
            setOpen={setOpen}
            defaultGroupId={defaultGroupId}
          />
        </div>
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

  // Get current time in HH:mm format
  const getCurrentTime = () => {
    const now = new Date();
    return format(now, "HH:mm");
  };

  const defaultDueDate = task?.dueDate ? new Date(task.dueDate) : undefined;
  const defaultTime = defaultDueDate
    ? format(defaultDueDate, "HH:mm")
    : getCurrentTime();

  const [timeValue, setTimeValue] = useState(defaultTime);
  const [openAddGroup, setOpenAddGroup] = useState(false);

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
      setTimeValue(getCurrentTime());
    }
  }, [open, task, form]);

  // Update time value when task changes
  useEffect(() => {
    if (task?.dueDate) {
      setTimeValue(format(new Date(task.dueDate), "HH:mm"));
    } else {
      setTimeValue(getCurrentTime());
    }
  }, [task]);

  // Handle group creation success - auto-select in form
  const handleGroupCreated = (groupId: string) => {
    form.setValue("groupId", groupId);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Combine date and time if date is set
    let combinedDueDate: Date | undefined = undefined;
    if (values.dueDate) {
      const date = new Date(values.dueDate);
      // Set time from time input, defaulting to current time if not provided
      const [hours, minutes] = (timeValue || getCurrentTime())
        .split(":")
        .map(Number);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {/* Scrollable form content */}
        <ScrollArea className="h-[68vh]">
          <div className="space-y-3 sm:space-y-4 p-2 pr-4 sm:pr-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
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
                  <FormLabel>Description (optional)</FormLabel>
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
                  <FormLabel>
                    Priority <span className="text-destructive">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    Group <span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setOpenAddGroup(true)}
                      className="shrink-0"
                      title="Add new group"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
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
                    const newDate = new Date(date);
                    // If editing an existing task, preserve the original time
                    // Otherwise use current time for new tasks
                    let timeToUse: string;
                    if (task && field.value) {
                      // Editing: preserve original time
                      timeToUse = format(new Date(field.value), "HH:mm");
                    } else if (timeValue) {
                      // Use existing timeValue if available
                      timeToUse = timeValue;
                    } else {
                      // New task: use current time
                      timeToUse = getCurrentTime();
                    }

                    const [hours, minutes] = timeToUse.split(":").map(Number);
                    newDate.setHours(hours || 0, minutes || 0, 0, 0);
                    field.onChange(newDate);
                    setTimeValue(timeToUse);
                  } else {
                    field.onChange(undefined);
                    setTimeValue(getCurrentTime());
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
                    <FormLabel>Due Date & Time (optional)</FormLabel>
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
                      <PopoverContent
                        className="flex w-auto max-w-[95vw] sm:max-w-none flex-col space-y-2 p-2"
                        align="start"
                      >
                        <Select
                          onValueChange={(value) => {
                            const date = new Date();
                            date.setDate(date.getDate() + parseInt(value, 10));
                            // handleDateSelect will preserve time if editing, or use current time for new tasks
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
                              <label className="text-sm font-medium">
                                Time:
                              </label>
                              <Input
                                type="time"
                                value={timeValue}
                                onChange={(e) =>
                                  handleTimeChange(e.target.value)
                                }
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
          </div>
        </ScrollArea>

        <div className="p-2 sm:p-0">
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
        </div>
      </form>
      <AddGroup
        open={openAddGroup}
        onOpenChange={setOpenAddGroup}
        onGroupCreated={handleGroupCreated}
      />
    </Form>
  );
}
