import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Task } from "@prisma/client";
import { useEffect, useState, useCallback, useRef } from "react";

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

export const formSchema = z.object({
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
  const { groupsQuery } = useGroups();
  const { createTaskMutation, updateTaskMutation } = useTasks();

  // Get current time in 24-hour format (HH:mm) for HTML input
  const getCurrentTime = useCallback(() => {
    const now = new Date();
    return format(now, "HH:mm");
  }, []);

  const [timeValue, setTimeValue] = useState("");
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [groupComboboxOpen, setGroupComboboxOpen] = useState(false);
  const prevOpenRef = useRef(false);
  const prevTaskIdRef = useRef<string | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      priority: "medium",
      groupId: "",
    },
  });

  // Reset form when dialog opens or task changes (but not when groupsQuery.data changes)
  useEffect(() => {
    const isFreshOpen = open && !prevOpenRef.current;
    const taskChanged = task?.id !== prevTaskIdRef.current;

    if (open && (isFreshOpen || taskChanged)) {
      const defaultDueDate = task?.dueDate ? new Date(task.dueDate) : undefined;
      const defaultTime = defaultDueDate
        ? format(defaultDueDate, "HH:mm")
        : getCurrentTime();

      form.reset({
        title: task?.title || "",
        dueDate: defaultDueDate,
        description: task?.description || "",
        groupId:
          task?.groupId ||
          defaultGroupId ||
          groupsQuery.data?.find((group) => group.name === "Inbox")?.id ||
          "",
        priority: task?.priority || "medium",
      });
      setTimeValue(defaultTime);

      // Update groupId when defaultGroupId changes (for new tasks only)
      if (!task && defaultGroupId && groupsQuery.data) {
        form.setValue("groupId", defaultGroupId);
      }
    }

    prevOpenRef.current = open;
    prevTaskIdRef.current = task?.id;
  }, [open, task, defaultGroupId, groupsQuery.data, form, getCurrentTime]);

  // Update groupId options when groupsQuery.data changes, but preserve form values
  useEffect(() => {
    if (open && groupsQuery.data) {
      // Only update groupId if it's not set or if we need to set a default for new tasks
      const currentGroupId = form.getValues("groupId");
      if (!currentGroupId && !task) {
        // Set default groupId for new tasks if not already set
        const defaultId =
          defaultGroupId ||
          groupsQuery.data.find((group) => group.name === "Inbox")?.id ||
          "";
        if (defaultId) {
          form.setValue("groupId", defaultId);
        }
      }
      // If currentGroupId doesn't exist in groups, we might want to handle it,
      // but we'll preserve user input so they can continue editing
    }
  }, [open, groupsQuery.data, form, task, defaultGroupId]);

  // Handle group creation success - auto-select in form
  const handleGroupCreated = (groupId: string) => {
    form.setValue("groupId", groupId);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Combine date and time if date is set
    let combinedDueDate: Date | undefined = undefined;
    if (values.dueDate) {
      const date = new Date(values.dueDate);
      const time24 = timeValue || getCurrentTime();
      const [hours, minutes] = time24.split(":").map(Number);
      date.setHours(hours || 0, minutes || 0, 0, 0);
      combinedDueDate = date;
    }

    const submitValues = {
      ...values,
      dueDate: combinedDueDate,
    };

    if (task) {
      updateTaskMutation.mutate({
        id: task.id,
        formValues: submitValues,
        onOpenChange: setOpen,
      });
    } else {
      createTaskMutation.mutate({
        formValues: submitValues,
        onOpenChange: setOpen,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[425px] flex flex-col"
        hideCloseButton
        preventClose
      >
        <DialogHeader className="px-2 flex-shrink-0">
          <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col space-y-3 sm:space-y-4 p-2 overflow-y-auto"
          >
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
                    <Textarea rows={3} {...field} />
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
              render={({ field }) => {
                const selectedGroup = groupsQuery.data?.find(
                  (group) => group.id === field.value
                );

                return (
                  <FormItem>
                    <FormLabel>
                      Group <span className="text-destructive">*</span>
                    </FormLabel>
                    <div className="flex gap-2">
                      <Popover
                        open={groupComboboxOpen}
                        onOpenChange={setGroupComboboxOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "flex-1 justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                              type="button"
                            >
                              {selectedGroup
                                ? selectedGroup.name
                                : "Select group"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search groups..." />
                            <CommandList>
                              <CommandEmpty>No groups found.</CommandEmpty>
                              <CommandGroup>
                                {groupsQuery.data?.map((group) => (
                                  <CommandItem
                                    key={group.id}
                                    value={group.name}
                                    onSelect={() => {
                                      field.onChange(group.id);
                                      setGroupComboboxOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === group.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {group.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                );
              }}
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
                    const timeToUse =
                      (task && field.value
                        ? format(new Date(field.value), "HH:mm")
                        : timeValue) || getCurrentTime();

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
                  ? `${format(new Date(field.value), "PPP")} at ${format(
                      new Date(field.value),
                      "h:mm a"
                    )}`
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
          <AddGroup
            open={openAddGroup}
            onOpenChange={setOpenAddGroup}
            onGroupCreated={handleGroupCreated}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}
