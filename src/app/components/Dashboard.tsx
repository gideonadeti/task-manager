"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useUser } from "@clerk/nextjs";
import {
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Plus,
  ArrowRight,
  Sun,
  CalendarRange,
  Inbox,
} from "lucide-react";
import { isToday, isTomorrow, isThisWeek, isPast, compareAsc } from "date-fns";

import useTasks from "@/hooks/use-tasks";
import useGroups from "@/hooks/use-groups";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { H1, H2 } from "../ui/CustomTags";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./Header";
import dynamic from "next/dynamic";
import { Task } from "@prisma/client";

// Dashboard components
import { StatCard } from "./dashboard/StatCard";
import { OverallProgress } from "./dashboard/OverallProgress";
import { ProductivityInsights } from "./dashboard/ProductivityInsights";
import { TaskCard } from "./dashboard/TaskCard";
import { QuickLink } from "./dashboard/QuickLink";

// Dynamically import AddTask and TaskDetailsDialog to reduce initial bundle size
const AddTask = dynamic(() => import("@/components/add-task"), {
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

  // Calculate enhanced stats
  const stats = useMemo(() => {
    if (!tasksQuery.data) {
      return {
        total: 0,
        completedToday: 0,
        overdue: 0,
        today: 0,
        totalTasks: 0,
        completedTasks: 0,
      };
    }

    const tasks = tasksQuery.data;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const incompleteTasks = tasks.filter((task) => !task.completed);
    const total = incompleteTasks.length;

    const completedToday = tasks.filter(
      (task) =>
        task.completed && task.updatedAt && isToday(new Date(task.updatedAt))
    ).length;

    const overdue = tasks.filter(
      (task) =>
        task.dueDate &&
        isPast(new Date(task.dueDate)) &&
        !isToday(new Date(task.dueDate)) &&
        !task.completed
    ).length;

    const today = tasks.filter(
      (task) =>
        task.dueDate && isToday(new Date(task.dueDate)) && !task.completed
    ).length;

    return {
      total,
      completedToday,
      overdue,
      today,
      totalTasks,
      completedTasks,
    };
  }, [tasksQuery.data]);

  // Calculate percentages for stat cards
  const statPercentages = useMemo(() => {
    if (!tasksQuery.data || tasksQuery.data.length === 0) {
      return {
        active: 0,
        today: 0,
        overdue: 0,
        completed: 0,
      };
    }

    const total = tasksQuery.data.length;
    return {
      active: Math.round((stats.total / total) * 100),
      today: Math.round((stats.today / total) * 100),
      overdue: Math.round((stats.overdue / total) * 100),
      completed: Math.round((stats.completedToday / total) * 100),
    };
  }, [tasksQuery.data, stats]);

  // Get recent tasks (up to 6, sorted by due date and priority)
  const recentTasks = useMemo(() => {
    if (!tasksQuery.data) return [];

    const incompleteTasks = tasksQuery.data.filter((task) => !task.completed);

    return incompleteTasks
      .sort((a, b) => {
        // Sort by due date first
        if (a.dueDate && b.dueDate) {
          const dateComparison = compareAsc(a.dueDate, b.dueDate);
          if (dateComparison !== 0) return dateComparison;
        } else if (a.dueDate) return -1;
        else if (b.dueDate) return 1;

        // Then by priority
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        return (
          (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
        );
      })
      .slice(0, 6);
  }, [tasksQuery.data]);

  // Get inbox group ID for default group
  const inboxGroupId = useMemo(() => {
    return groupsQuery.data?.find((group) => group.name === "Inbox")?.id;
  }, [groupsQuery.data]);

  // Get task counts for quick links
  const quickLinkCounts = useMemo(() => {
    if (!tasksQuery.data || !groupsQuery.data) {
      return { today: 0, tomorrow: 0, thisWeek: 0 };
    }

    const tasks = tasksQuery.data;

    return {
      today: tasks.filter(
        (task) => task.dueDate && isToday(task.dueDate) && !task.completed
      ).length,
      tomorrow: tasks.filter(
        (task) => task.dueDate && isTomorrow(task.dueDate) && !task.completed
      ).length,
      thisWeek: tasks.filter(
        (task) => task.dueDate && isThisWeek(task.dueDate) && !task.completed
      ).length,
    };
  }, [tasksQuery.data, groupsQuery.data]);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 sm:h-36" />
              ))}
            </div>
            <Skeleton className="h-24 mb-6" />
            <Skeleton className="h-64" />
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
          {tasksQuery.data && tasksQuery.data.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <OverallProgress
                completed={stats.completedTasks}
                total={stats.totalTasks}
              />
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <StatCard
              title="Active Tasks"
              value={stats.total}
              icon={Inbox}
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              delay={0.1}
              percentage={statPercentages.active}
              total={stats.totalTasks}
              tooltip={`${stats.total} active tasks out of ${stats.totalTasks} total`}
            />
            <StatCard
              title="Due Today"
              value={stats.today}
              icon={Sun}
              color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
              delay={0.2}
              percentage={statPercentages.today}
              tooltip={`${stats.today} tasks due today`}
            />
            <StatCard
              title="Overdue"
              value={stats.overdue}
              icon={AlertTriangle}
              color="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              delay={0.3}
              percentage={statPercentages.overdue}
              tooltip={`${stats.overdue} overdue tasks`}
            />
            <StatCard
              title="Completed Today"
              value={stats.completedToday}
              icon={CheckCircle2}
              color="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              delay={0.4}
              percentage={statPercentages.completed}
              tooltip={`${stats.completedToday} tasks completed today`}
            />
          </div>

          {/* Productivity Insights */}
          {tasksQuery.data && tasksQuery.data.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <ProductivityInsights tasks={tasksQuery.data} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <H2 className="text-xl sm:text-2xl">Quick Actions</H2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        Press Ctrl+N
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Keyboard shortcut to create a new task</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                onClick={() => setAddTaskOpen(true)}
                className="w-full h-auto p-4 sm:p-6 text-base sm:text-lg focus-visible:ring-2"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Task
              </Button>
              <div className="space-y-2">
                <QuickLink
                  href="/groups/today"
                  title="Today"
                  icon={Sun}
                  count={quickLinkCounts.today}
                  delay={0.6}
                />
                <QuickLink
                  href="/groups/tomorrow"
                  title="Tomorrow"
                  icon={Calendar}
                  count={quickLinkCounts.tomorrow}
                  delay={0.7}
                />
                <QuickLink
                  href="/groups/this-week"
                  title="This Week"
                  icon={CalendarRange}
                  count={quickLinkCounts.thisWeek}
                  delay={0.8}
                />
                <QuickLink
                  href="/groups/inbox"
                  title="Inbox"
                  icon={Inbox}
                  delay={0.9}
                />
              </div>
            </motion.div>

            {/* Recent Tasks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <H2 className="text-xl sm:text-2xl">Recent Tasks</H2>
                {recentTasks.length > 0 && (
                  <Link href="/groups/today">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="focus-visible:ring-2"
                    >
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
              {recentTasks.length > 0 ? (
                <div className="space-y-2">
                  {recentTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      groups={groupsQuery.data || []}
                      index={index}
                      onTaskClick={handleTaskClick}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-8 sm:p-12 text-center bg-card/50 backdrop-blur-sm"
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
            </motion.div>
          </div>
        </div>

        {inboxGroupId && (
          <AddTask
            open={addTaskOpen}
            setOpen={setAddTaskOpen}
            defaultGroupId={inboxGroupId}
          />
        )}

        <TaskDetailsDialog
          task={selectedTask}
          open={taskDetailsOpen}
          onOpenChange={handleTaskDetailsClose}
        />
      </main>
    </SidebarProvider>
  );
}
