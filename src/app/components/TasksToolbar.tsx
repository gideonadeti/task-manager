"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Plus,
  X,
  Trash2,
  CheckCircle2,
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

interface TasksToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriorities: string[];
  onPrioritiesChange: (priorities: string[]) => void;
  tasks?: Task[];
  selectedTaskCount?: number;
  onDeselectAll?: () => void;
}

export default function TasksToolbar({
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPrioritiesChange,
  tasks,
  selectedTaskCount = 0,
  onDeselectAll,
}: TasksToolbarProps) {
  const [openAdd, setOpenAdd] = useState(false);
  const isFiltered = searchQuery.trim() !== "" || selectedPriorities.length > 0;
  const { groupId } = useParams();
  const { groupsQuery } = useGroups();

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
              <MagnifyingGlassIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
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
              <Cross2Icon className="h-4 w-4 sm:ml-2" />
            </Button>
          )}
        </div>
        {/* Selected Tasks Counter and Create Task Button */}
        <div className="flex items-center gap-2">
          {selectedTaskCount > 0 && (
            <>
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
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 sm:h-8 min-h-[44px] sm:min-h-0 gap-2"
                  >
                    <span className="hidden sm:inline">Bulk Actions</span>
                    <span className="sm:hidden">Actions</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      // TODO: Implement mark as complete
                      console.log("Mark as complete");
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      // TODO: Implement change priority
                      console.log("Change priority");
                    }}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Change Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      // TODO: Implement move to group
                      console.log("Move to group");
                    }}
                  >
                    <FolderInput className="mr-2 h-4 w-4" />
                    Move to Group
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      // TODO: Implement delete
                      console.log("Delete");
                    }}
                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <Button
            onClick={() => setOpenAdd(true)}
            className="h-11 sm:h-8 min-h-[44px] sm:min-h-0 gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
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
    </>
  );
}
