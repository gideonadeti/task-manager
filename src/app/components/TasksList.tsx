"use client";

import { useState, useMemo } from "react";
import { Task } from "@prisma/client";
import TasksToolbar from "./TasksToolbar";
import TaskCards from "./TaskCards";

interface TasksListProps {
  data: Task[];
}

function TasksList({ data }: TasksListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    let filtered = data;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description?.toLowerCase().includes(query) ?? false)
      );
    }

    // Filter by priority
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((task) =>
        selectedPriorities.includes(task.priority)
      );
    }

    return filtered;
  }, [data, searchQuery, selectedPriorities]);

  return (
    <div className="h-screen overflow-y-auto pb-4 sm:pb-14 space-y-4 px-2 sm:px-4 lg:px-8 pt-4">
      <TasksToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriorities={selectedPriorities}
        onPrioritiesChange={setSelectedPriorities}
        tasks={data}
      />
      <TaskCards tasks={filteredTasks} />
    </div>
  );
}

export { TasksList };

