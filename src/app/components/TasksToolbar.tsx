"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
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
}

export default function TasksToolbar({
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPrioritiesChange,
  tasks,
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <InputGroup className="h-8 flex-1 min-w-[120px] max-w-[300px]">
            <InputGroupAddon align="inline-start">
              <MagnifyingGlassIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search task..."
              value={searchQuery}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(event.target.value)
              }
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
              className="h-8 px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Reset</span>
              <Cross2Icon className="sm:ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={() => setOpenAdd(true)} className="h-8 gap-2 min-h-[44px] sm:min-h-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Task</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>
      <AddTask
        open={openAdd}
        setOpen={setOpenAdd}
        defaultGroupId={defaultGroupId}
      />
    </>
  );
}
