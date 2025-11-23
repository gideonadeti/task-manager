"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Plus,
  Inbox,
  FolderPlus,
  ArrowRight,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { isThisWeek, isPast, isToday, compareAsc } from "date-fns";
import { Task } from "@prisma/client";

import useTasks from "@/hooks/use-tasks";
import useGroups from "@/hooks/use-groups";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { H1, H2 } from "../ui/CustomTags";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./Header";
import dynamic from "next/dynamic";

// Dashboard components
import { OverallProgress } from "./dashboard/OverallProgress";
import { TaskCard } from "./dashboard/TaskCard";

// Dynamically import AddTask and AddGroup to reduce initial bundle size
const AddTask = dynamic(() => import("@/components/add-task"), {
  loading: () => null,
});

const AddGroup = dynamic(() => import("@/components/add-group"), {
  loading: () => null,
});

const TaskDetailsDialog = dynamic(() => import("./TaskDetailsDialog"), {
  loading: () => null,
});

export default function Dashboard() {
  const { user } = useUser();
  const { tasksQuery } = useTasks();
  const { groupsQuery } = useGroups();
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);

  // Get user's first name
  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "";

  // Keyboard shortcut for creating task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "n" || e.key === "N") &&
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setAddTaskOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Calculate stats for overall progress
  const stats = useMemo(() => {
    if (!tasksQuery.data) {
      return {
        totalTasks: 0,
        completedTasks: 0,
      };
    }

    const tasks = tasksQuery.data;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;

    return {
      totalTasks,
      completedTasks,
    };
  }, [tasksQuery.data]);

  // Get inbox group ID for default group
  const inboxGroupId = useMemo(() => {
    return groupsQuery.data?.find((group) => group.name === "Inbox")?.id;
  }, [groupsQuery.data]);

  // Get overdue tasks (ordered by priority)
  const overdueTasks = useMemo(() => {
    if (!tasksQuery.data) return [];

    const overdue = tasksQuery.data.filter(
      (task) =>
        task.dueDate &&
        isPast(new Date(task.dueDate)) &&
        !isToday(new Date(task.dueDate)) &&
        !task.completed
    );

    // Sort by priority (high -> medium -> low), then by due date
    return overdue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
      if (priorityDiff !== 0) return -priorityDiff;

      if (a.dueDate && b.dueDate) {
        return compareAsc(a.dueDate, b.dueDate);
      }
      return 0;
    });
  }, [tasksQuery.data]);

  // Get tasks due this week (max 4, ordered by priority)
  const tasksThisWeek = useMemo(() => {
    if (!tasksQuery.data) return [];

    const tasksDueThisWeek = tasksQuery.data.filter(
      (task) =>
        task.dueDate && isThisWeek(new Date(task.dueDate)) && !task.completed
    );

    // Sort by priority (high -> medium -> low), then by due date
    return tasksDueThisWeek
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff =
          (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
        if (priorityDiff !== 0) return -priorityDiff;

        if (a.dueDate && b.dueDate) {
          return compareAsc(a.dueDate, b.dueDate);
        }
        return 0;
      })
      .slice(0, 4);
  }, [tasksQuery.data]);

  // Get total count of tasks due this week (for display)
  const tasksThisWeekCount = useMemo(() => {
    if (!tasksQuery.data) return 0;
    return tasksQuery.data.filter(
      (task) =>
        task.dueDate && isThisWeek(new Date(task.dueDate)) && !task.completed
    ).length;
  }, [tasksQuery.data]);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  }, []);

  const handleTaskDetailsClose = useCallback((open: boolean) => {
    setTaskDetailsOpen(open);
    if (!open) {
      setSelectedTask(null);
    }
  }, []);

  if (tasksQuery.isPending || groupsQuery.isPending) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-grow flex flex-col min-h-svh">
          <Header />
          <div className="flex-1 px-2 sm:px-4 lg:px-6 py-2 sm:py-4 max-w-7xl mx-auto w-full">
            {/* Header Skeleton */}
            <div className="mb-6 sm:mb-8">
              <Skeleton className="h-8 sm:h-10 lg:h-12 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>

            {/* Overall Progress Skeleton */}
            <div className="mb-6 sm:mb-8">
              <Skeleton className="h-24 sm:h-28 rounded-lg" />
            </div>

            {/* Quick Actions Skeleton */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-12 sm:h-11 w-full sm:w-40" />
                <Skeleton className="h-12 sm:h-11 w-full sm:w-40" />
              </div>
            </div>

            {/* Section Skeleton */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-grow flex flex-col min-h-svh">
        <Header />
        <div className="flex-1 px-2 sm:px-4 lg:px-6 py-2 sm:py-4 max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-6 sm:mb-8"
          >
            <H1 className="text-2xl sm:text-3xl lg:text-4xl mb-2">
              Welcome Back{firstName ? `, ${firstName}` : ""}
            </H1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Here&apos;s an overview of your tasks
            </p>
          </motion.div>

          {/* Overall Progress */}
          {tasksQuery.data && tasksQuery.data.length > 0 ? (
            <div className="mb-6 sm:mb-8">
              <OverallProgress
                completed={stats.completedTasks}
                total={stats.totalTasks}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4 sm:p-8 lg:p-12 text-center bg-card/50 backdrop-blur-sm mb-6 sm:mb-8 w-full overflow-x-hidden"
            >
              <Inbox className="size-10 sm:size-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">
                No tasks yet
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 px-2">
                Get started by creating your first task or group
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 w-full min-w-0">
                <Button
                  onClick={() => setAddTaskOpen(true)}
                  className="flex-1 sm:flex-initial focus-visible:ring-2 min-w-0"
                  size="lg"
                >
                  <Plus className="size-4 sm:size-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="text-xs sm:text-base truncate">
                    Create Task
                  </span>
                </Button>
                <Button
                  onClick={() => setAddGroupOpen(true)}
                  variant="outline"
                  className="flex-1 sm:flex-initial focus-visible:ring-2 min-w-0"
                  size="lg"
                >
                  <FolderPlus className="size-4 sm:size-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="text-xs sm:text-base truncate">
                    Create Group
                  </span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Quick Actions - Only show when there are tasks */}
          {tasksQuery.data && tasksQuery.data.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => setAddTaskOpen(true)}
                  className="flex-1 sm:flex-initial focus-visible:ring-2"
                  size="lg"
                >
                  <Plus className="size-5 mr-2" />
                  Create Task
                </Button>
                <Button
                  onClick={() => setAddGroupOpen(true)}
                  variant="outline"
                  className="flex-1 sm:flex-initial focus-visible:ring-2"
                  size="lg"
                >
                  <FolderPlus className="size-5 mr-2" />
                  Create Group
                </Button>
              </div>
            </motion.div>
          )}

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-red-500" />
                  <H2 className="text-xl sm:text-2xl text-red-600 dark:text-red-400">
                    Overdue
                  </H2>
                  <span className="text-sm text-muted-foreground">
                    ({overdueTasks.length})
                  </span>
                </div>
                <Link href="/groups/overdue">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="focus-visible:ring-2"
                  >
                    See all
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                {overdueTasks.slice(0, 4).map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    groups={groupsQuery.data || []}
                    index={index}
                    onTaskClick={handleTaskClick}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Tasks Due This Week */}
          {tasksThisWeek.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <H2 className="text-xl sm:text-2xl">
                  Due This Week
                  {tasksThisWeekCount > 0 && (
                    <span className="ml-2 text-base text-muted-foreground font-normal">
                      ({tasksThisWeekCount})
                    </span>
                  )}
                </H2>
                <Link href="/groups/this-week">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="focus-visible:ring-2"
                  >
                    See all
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                {tasksThisWeek.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    groups={groupsQuery.data || []}
                    index={index}
                    onTaskClick={handleTaskClick}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            tasksQuery.data &&
            tasksQuery.data.length > 0 &&
            !overdueTasks.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                className="mb-6 sm:mb-8"
              >
                <div className="border rounded-lg p-6 sm:p-8 text-center bg-card/50 backdrop-blur-sm">
                  <Calendar className="size-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-base mb-2">
                    No tasks due this week
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You&apos;re all caught up! Add due dates to tasks to see
                    them here.
                  </p>
                  <Link href="/groups/this-week">
                    <Button variant="outline" size="sm">
                      View all tasks
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )
          )}
        </div>

        {inboxGroupId && (
          <AddTask
            open={addTaskOpen}
            setOpen={setAddTaskOpen}
            defaultGroupId={inboxGroupId}
          />
        )}

        <AddGroup open={addGroupOpen} onOpenChange={setAddGroupOpen} />

        <TaskDetailsDialog
          task={selectedTask}
          open={taskDetailsOpen}
          onOpenChange={handleTaskDetailsClose}
        />
      </main>
    </SidebarProvider>
  );
}
