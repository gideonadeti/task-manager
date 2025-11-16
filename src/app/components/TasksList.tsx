"use client";

import { useState, useMemo, useCallback } from "react";
import { Task } from "@prisma/client";
import TasksToolbar from "./TasksToolbar";
import TaskCards from "./TaskCards";
import useBulkTasks from "@/hooks/use-bulk-tasks";

interface TasksListProps {
  data: Task[];
}

function TasksList({ data }: TasksListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );

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

  const handleSelectAll = useCallback(() => {
    const allTaskIds = new Set(filteredTasks.map((task) => task.id));
    setSelectedTaskIds(allTaskIds);
  }, [filteredTasks]);

  const handleDeselectAll = useCallback(() => {
    setSelectedTaskIds(new Set());
  }, []);

  const {
    bulkMarkCompleteMutation,
    bulkUpdatePriorityMutation,
    bulkUpdateGroupMutation,
    bulkDeleteMutation,
  } = useBulkTasks();

  const handleSelectionChange = useCallback(
    (taskId: string, checked: boolean) => {
      setSelectedTaskIds((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(taskId);
        } else {
          newSet.delete(taskId);
        }
        return newSet;
      });
    },
    []
  );

  const handleBulkMarkComplete = useCallback(() => {
    const taskIdsArray = Array.from(selectedTaskIds);
    // Optimistically deselect immediately
    handleDeselectAll();
    bulkMarkCompleteMutation.mutate(taskIdsArray);
  }, [selectedTaskIds, bulkMarkCompleteMutation, handleDeselectAll]);

  const handleBulkUpdatePriority = useCallback(
    (priority: string) => {
      const taskIdsArray = Array.from(selectedTaskIds);
      // Optimistically deselect immediately
      handleDeselectAll();
      bulkUpdatePriorityMutation.mutate({ taskIds: taskIdsArray, priority });
    },
    [selectedTaskIds, bulkUpdatePriorityMutation, handleDeselectAll]
  );

  const handleBulkUpdateGroup = useCallback(
    (groupId: string) => {
      const taskIdsArray = Array.from(selectedTaskIds);
      // Optimistically deselect immediately
      handleDeselectAll();
      bulkUpdateGroupMutation.mutate({ taskIds: taskIdsArray, groupId });
    },
    [selectedTaskIds, bulkUpdateGroupMutation, handleDeselectAll]
  );

  const handleBulkDelete = useCallback(() => {
    const taskIdsArray = Array.from(selectedTaskIds);
    // Optimistically deselect immediately
    handleDeselectAll();
    bulkDeleteMutation.mutate(taskIdsArray);
  }, [selectedTaskIds, bulkDeleteMutation, handleDeselectAll]);

  return (
    <div className="h-full overflow-y-auto p-2 pb-4 sm:pb-14 space-y-4">
      <TasksToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriorities={selectedPriorities}
        onPrioritiesChange={setSelectedPriorities}
        tasks={data}
        selectedTaskCount={selectedTaskIds.size}
        selectedTaskIds={selectedTaskIds}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkMarkComplete={handleBulkMarkComplete}
        onBulkUpdatePriority={handleBulkUpdatePriority}
        onBulkUpdateGroup={handleBulkUpdateGroup}
        onBulkDelete={handleBulkDelete}
        isBulkDeletePending={bulkDeleteMutation.isPending}
      />
      <TaskCards
        tasks={filteredTasks}
        selectedTaskIds={selectedTaskIds}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}

export { TasksList };
