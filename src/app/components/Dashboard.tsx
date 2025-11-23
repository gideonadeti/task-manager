"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Plus, Inbox, FolderPlus, ArrowRight } from "lucide-react";
import { isThisWeek, compareAsc } from "date-fns";
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

  // Get urgent tasks this week (max 4, ordered by priority)
  const urgentTasksThisWeek = useMemo(() => {
    if (!tasksQuery.data) return [];

    const tasksDueThisWeek = tasksQuery.data.filter(
      (task) =>
        task.dueDate && isThisWeek(new Date(task.dueDate)) && !task.completed
    );

    // Sort by priority (high -> medium -> low), then by due date
    return tasksDueThisWeek
      .sort((a, b) => {
        // First sort by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff =
          (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
        if (priorityDiff !== 0) return -priorityDiff; // Negative for descending

        // Then by due date
        if (a.dueDate && b.dueDate) {
          return compareAsc(a.dueDate, b.dueDate);
        }
        return 0;
      })
      .slice(0, 4);
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
            <Skeleton className="h-8 sm:h-10 w-48 mb-6" />
            <Skeleton className="h-24" />
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
              className="border rounded-lg p-8 sm:p-12 text-center bg-card/50 backdrop-blur-sm mb-6 sm:mb-8"
            >
              <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No tasks yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first task
              </p>
              <Button
                onClick={() => setAddTaskOpen(true)}
                className="focus-visible:ring-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setAddTaskOpen(true)}
                className="flex-1 sm:flex-none"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Task
              </Button>
              <Button
                onClick={() => setAddGroupOpen(true)}
                variant="outline"
                className="flex-1 sm:flex-none"
                size="lg"
              >
                <FolderPlus className="h-5 w-5 mr-2" />
                Create Group
              </Button>
            </div>
          </motion.div>

          {/* Urgent Tasks This Week */}
          {urgentTasksThisWeek.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <H2 className="text-xl sm:text-2xl">Due This Week</H2>
                <Link href="/groups/this-week">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="focus-visible:ring-2"
                  >
                    See all
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                {urgentTasksThisWeek.map((task, index) => (
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
