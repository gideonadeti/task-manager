"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import PriorityFilter from "./PriorityFilter";
import AddTask from "@/components/add-task";
import useGroups from "@/hooks/use-groups";

interface TasksToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriorities: string[];
  onPrioritiesChange: (priorities: string[]) => void;
}

export default function TasksToolbar({
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPrioritiesChange,
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <InputGroup className="h-8 w-[150px] lg:w-[250px]">
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
          />
          {isFiltered && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={() => setOpenAdd(true)} className="h-8 gap-2">
          <Plus className="h-4 w-4" />
          Create Task
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
