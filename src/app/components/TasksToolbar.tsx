"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import PriorityFilter from "./PriorityFilter";

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
  const isFiltered = searchQuery.trim() !== "" || selectedPriorities.length > 0;

  const handleReset = () => {
    onSearchChange("");
    onPrioritiesChange([]);
  };

  return (
    <div className="flex items-center justify-between">
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
    </div>
  );
}
