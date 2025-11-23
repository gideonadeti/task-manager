"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Plus,
  X,
  Trash2,
  CheckCircle2,
  Circle,
  Tag,
  FolderInput,
  ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import PriorityFilter from "./PriorityFilter";
import useGroups from "@/hooks/use-groups";
import { Task } from "@prisma/client";

// Dynamically import AddTask to reduce initial bundle size
const AddTask = dynamic(() => import("@/components/add-task"), {
  loading: () => null, // No loading indicator needed as it's only shown when dialog is open
});

const BulkPriorityDialog = dynamic(() => import("./BulkPriorityDialog"), {
  loading: () => null,
});

const BulkGroupDialog = dynamic(() => import("./BulkGroupDialog"), {
  loading: () => null,
});

const BulkDeleteDialog = dynamic(() => import("./BulkDeleteDialog"), {
  loading: () => null,
});

interface TasksToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriorities: string[];
  onPrioritiesChange: (priorities: string[]) => void;
  tasks?: Task[];
  selectedTaskCount?: number;
  selectedTaskIds?: Set<string>;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onBulkMarkComplete?: () => void;
  onBulkUpdatePriority?: (priority: string) => void;
  onBulkUpdateGroup?: (groupId: string) => void;
  onBulkDelete?: (onOpenChange: (open: boolean) => void) => void;
  isBulkDeletePending?: boolean;
}

export default function TasksToolbar({
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPrioritiesChange,
  tasks,
  selectedTaskCount = 0,
  selectedTaskIds,
  onSelectAll,
  onDeselectAll,
  onBulkMarkComplete,
  onBulkUpdatePriority,
  onBulkUpdateGroup,
  onBulkDelete,
  isBulkDeletePending = false,
}: TasksToolbarProps) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openPriorityDialog, setOpenPriorityDialog] = useState(false);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const isFiltered = searchQuery.trim() !== "" || selectedPriorities.length > 0;
  const { groupId } = useParams();
  const { groupsQuery } = useGroups();

  // Keyboard shortcut: Ctrl/Cmd + Alt/Option + T to add new task
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "t" &&
        (event.metaKey || event.ctrlKey) &&
        event.altKey &&
        !event.shiftKey
      ) {
        // Don't trigger if user is typing in an input field
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        event.preventDefault();
        setOpenAdd(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + Alt/Option + C to toggle selected tasks completion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "c" &&
        (event.metaKey || event.ctrlKey) &&
        event.altKey &&
        !event.shiftKey &&
        selectedTaskCount > 0 &&
        onBulkMarkComplete
      ) {
        // Don't trigger if user is typing in an input field
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        event.preventDefault();
        onBulkMarkComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskCount, onBulkMarkComplete]);

  // Determine the label and icon for the bulk mark complete action
  // Since tasks are filtered by completion status, we can determine the action based on the route
  // In "completed" view, all tasks are complete, so action should be "Mark as Incomplete"
  // In other views, all tasks are incomplete, so action should be "Mark as Complete"
  const bulkToggleLabel = useMemo(() => {
    if (groupId === "completed") {
      return "Mark as Incomplete";
    }
    // Check selected tasks' actual state as fallback (if we have selectedTaskIds and tasks)
    if (selectedTaskIds && tasks && selectedTaskIds.size > 0) {
      const selectedTasks = tasks.filter((t) => selectedTaskIds.has(t.id));
      if (selectedTasks.length > 0) {
        // If all selected tasks are complete, show "Mark as Incomplete"
        const allComplete = selectedTasks.every((t) => t.completed);
        if (allComplete) {
          return "Mark as Incomplete";
        }
        // If all selected tasks are incomplete, show "Mark as Complete"
        const allIncomplete = selectedTasks.every((t) => !t.completed);
        if (allIncomplete) {
          return "Mark as Complete";
        }
      }
    }
    // Default: "Mark as Complete" (for regular views where tasks are incomplete)
    return "Mark as Complete";
  }, [groupId, selectedTaskIds, tasks]);

  const bulkToggleIcon = useMemo(() => {
    return bulkToggleLabel === "Mark as Incomplete" ? Circle : CheckCircle2;
  }, [bulkToggleLabel]);

  // Check if all selected tasks are completed
  const areAllSelectedTasksCompleted = useMemo(() => {
    if (!selectedTaskIds || !tasks || selectedTaskIds.size === 0) {
      return false;
    }
    const selectedTasks = tasks.filter((t) => selectedTaskIds.has(t.id));
    if (selectedTasks.length === 0) return false;
    return selectedTasks.every((t) => t.completed);
  }, [selectedTaskIds, tasks]);

  // Get the group ID to exclude from bulk move dialog
  // Only exclude if it's an actual group (not a special view)
  const excludeGroupId = useMemo(() => {
    if (!groupId || !groupsQuery.data) return undefined;

    // Special views that don't represent a single group - don't exclude anything
    const specialViews = [
      "today",
      "tomorrow",
      "this-week",
      "overdue",
      "completed",
    ];
    if (specialViews.includes(groupId as string)) {
      return undefined;
    }

    // Handle "inbox" route - exclude the Inbox group
    if (groupId === "inbox") {
      return groupsQuery.data.find((group) => group.name === "Inbox")?.id;
    }

    // For actual group IDs (UUIDs), exclude them
    return groupId as string;
  }, [groupId, groupsQuery.data]);

  // Get the actual group ID to prefill the form
  // Handles special routes like "inbox" and regular group IDs
  const defaultGroupId = useMemo(() => {
    if (!groupId || !groupsQuery.data) return undefined;

    // Special views that don't have a single group - default to Inbox
    const specialViews = [
      "today",
      "tomorrow",
      "this-week",
      "overdue",
      "completed",
    ];
    if (specialViews.includes(groupId as string)) {
      return groupsQuery.data.find((group) => group.name === "Inbox")?.id;
    }

    // Handle "inbox" route - find the actual Inbox group ID
    if (groupId === "inbox") {
      return groupsQuery.data.find((group) => group.name === "Inbox")?.id;
    }

    // For actual group IDs (UUIDs), return as is
    return groupId as string;
  }, [groupId, groupsQuery.data]);

  const handleReset = () => {
    onSearchChange("");
    onPrioritiesChange([]);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2">
        {/* Search and Filters Section */}
        <div className="flex flex-1 items-center gap-2 sm:gap-2 flex-wrap">
          <InputGroup className="h-11 sm:h-8 flex-1 min-w-0 sm:min-w-[120px] sm:max-w-[300px]">
            <InputGroupAddon align="inline-start">
              <MagnifyingGlassIcon className="size-4 sm:size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search task..."
              value={searchQuery}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(event.target.value)
              }
              className="text-base sm:text-sm"
            />
          </InputGroup>
          <PriorityFilter
            selectedPriorities={selectedPriorities}
            onPrioritiesChange={onPrioritiesChange}
            tasks={tasks}
          />
          {isFiltered && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-11 sm:h-8 min-h-[44px] sm:min-h-0 px-3 sm:px-3"
              aria-label="Reset filters"
            >
              <span className="hidden sm:inline">Reset</span>
              <Cross2Icon className="size-4 sm:ml-2" />
            </Button>
          )}
        </div>
        {/* Selected Tasks Counter and Create Task Button */}
        <div className="flex items-center gap-2">
          {tasks && tasks.length > 0 && (
            <>
              {selectedTaskCount > 0 ? (
                <div className="flex items-center gap-2 h-11 sm:h-8 min-h-[44px] sm:min-h-0 px-3 rounded-md bg-muted border border-border">
                  <span className="text-sm text-muted-foreground">
                    {selectedTaskCount}{" "}
                    {selectedTaskCount === 1 ? "task" : "tasks"} selected
                  </span>
                  {onDeselectAll && (
                    <button
                      onClick={onDeselectAll}
                      className="ml-1 p-0.5 rounded-sm hover:bg-muted-foreground/20 transition-colors"
                      aria-label="Deselect all tasks"
                    >
                      <X className="size-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              ) : (
                onSelectAll && (
                  <Button
                    variant="outline"
                    onClick={onSelectAll}
                    className="h-11 sm:h-8 min-h-[44px] sm:min-h-0"
                    aria-label="Select all tasks"
                  >
                    <span className="hidden sm:inline">Select All</span>
                    <span className="sm:hidden">Select All</span>
                  </Button>
                )
              )}
              {selectedTaskCount > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 sm:h-8 min-h-[44px] sm:min-h-0 gap-2"
                    >
                      <span className="hidden sm:inline">Bulk Actions</span>
                      <span className="sm:hidden">Actions</span>
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        onBulkMarkComplete?.();
                      }}
                    >
                      {React.createElement(bulkToggleIcon, {
                        className: "size-4",
                      })}
                      {bulkToggleLabel}
                    </DropdownMenuItem>
                    {!areAllSelectedTasksCompleted && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenPriorityDialog(true);
                          }}
                        >
                          <Tag className="size-4" />
                          Change Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenGroupDialog(true);
                          }}
                        >
                          <FolderInput className="size-4" />
                          Move to Group
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenDeleteDialog(true);
                      }}
                      className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
          <Button
            onClick={() => setOpenAdd(true)}
            className="h-11 sm:h-8 min-h-[44px] sm:min-h-0 gap-2 w-full sm:w-auto"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Create Task</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>
      <AddTask
        open={openAdd}
        setOpen={setOpenAdd}
        defaultGroupId={defaultGroupId}
      />
      {onBulkUpdatePriority && (
        <BulkPriorityDialog
          open={openPriorityDialog}
          onOpenChange={setOpenPriorityDialog}
          onSelectPriority={onBulkUpdatePriority}
        />
      )}
      {onBulkUpdateGroup && (
        <BulkGroupDialog
          open={openGroupDialog}
          onOpenChange={setOpenGroupDialog}
          onSelectGroup={onBulkUpdateGroup}
          excludeGroupId={excludeGroupId}
        />
      )}
      {onBulkDelete && (
        <BulkDeleteDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          onConfirm={() => {
            onBulkDelete(setOpenDeleteDialog);
          }}
          taskCount={selectedTaskCount}
          isPending={isBulkDeletePending}
        />
      )}
    </>
  );
}
