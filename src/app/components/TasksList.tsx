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

  const handleDeselectAll = useCallback(() => {
    setSelectedTaskIds(new Set());
  }, []);

  const {
    bulkMarkCompleteMutation,
    bulkUpdatePriorityMutation,
    bulkUpdateGroupMutation,
    bulkDeleteMutation,
  } = useBulkTasks({
    onSuccess: handleDeselectAll,
  });

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
    bulkMarkCompleteMutation.mutate(taskIdsArray);
  }, [selectedTaskIds, bulkMarkCompleteMutation]);

  const handleBulkUpdatePriority = useCallback(
    (priority: string) => {
      const taskIdsArray = Array.from(selectedTaskIds);
      bulkUpdatePriorityMutation.mutate({ taskIds: taskIdsArray, priority });
    },
    [selectedTaskIds, bulkUpdatePriorityMutation]
  );

  const handleBulkUpdateGroup = useCallback(
    (groupId: string) => {
      const taskIdsArray = Array.from(selectedTaskIds);
      bulkUpdateGroupMutation.mutate({ taskIds: taskIdsArray, groupId });
    },
    [selectedTaskIds, bulkUpdateGroupMutation]
  );

  const handleBulkDelete = useCallback(() => {
    const taskIdsArray = Array.from(selectedTaskIds);
    bulkDeleteMutation.mutate(taskIdsArray);
  }, [selectedTaskIds, bulkDeleteMutation]);

  return (
    <div className="h-full overflow-y-auto p-2 pb-4 sm:pb-14 space-y-4">
      <TasksToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriorities={selectedPriorities}
        onPrioritiesChange={setSelectedPriorities}
        tasks={data}
        selectedTaskCount={selectedTaskIds.size}
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
