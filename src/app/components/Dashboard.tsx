"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
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
import { H1, H2 } from "../ui/CustomTags";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./Header";
import dynamic from "next/dynamic";

// Dynamically import AddTask to reduce initial bundle size
const AddTask = dynamic(() => import("@/components/add-task"), {
  loading: () => null,
});

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay?: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="border rounded-lg p-4 sm:p-6 bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <span className="text-2xl sm:text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
    </motion.div>
  );
}

interface QuickLinkProps {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  delay?: number;
}

function QuickLink({
  href,
  title,
  icon: Icon,
  count,
  delay = 0,
}: QuickLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Link href={href}>
        <Button
          variant="outline"
          className="w-full justify-between h-auto p-4 hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {count !== undefined && (
              <span className="text-sm text-muted-foreground">{count}</span>
            )}
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const { tasksQuery } = useTasks();
  const { groupsQuery } = useGroups();
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    if (!tasksQuery.data) {
      return {
        total: 0,
        completedToday: 0,
        overdue: 0,
        today: 0,
      };
    }

    const tasks = tasksQuery.data;
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
      total: tasks.filter((task) => !task.completed).length,
      completedToday,
      overdue,
      today,
    };
  }, [tasksQuery.data]);

  // Get recent tasks (up to 6, sorted by due date and priority)
  const recentTasks = useMemo(() => {
    if (!tasksQuery.data) return [];

    const incompleteTasks = tasksQuery.data.filter((task) => !task.completed);

    return incompleteTasks
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        const dateComparison = compareAsc(a.dueDate, b.dueDate);
        if (dateComparison !== 0) return dateComparison;
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

  if (tasksQuery.isPending || groupsQuery.isPending) {
    return (
      <div className="flex-1 px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <Skeleton className="h-8 sm:h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
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
              Welcome Back
            </H1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Here&apos;s an overview of your tasks
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <StatCard
              title="Active Tasks"
              value={stats.total}
              icon={Inbox}
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              delay={0.1}
            />
            <StatCard
              title="Due Today"
              value={stats.today}
              icon={Sun}
              color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
              delay={0.2}
            />
            <StatCard
              title="Overdue"
              value={stats.overdue}
              icon={AlertTriangle}
              color="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              delay={0.3}
            />
            <StatCard
              title="Completed Today"
              value={stats.completedToday}
              icon={CheckCircle2}
              color="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              delay={0.4}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              <H2 className="text-xl sm:text-2xl mb-4">Quick Actions</H2>
              <Button
                onClick={() => setAddTaskOpen(true)}
                className="w-full h-auto p-4 sm:p-6 text-base sm:text-lg"
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
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
              {recentTasks.length > 0 ? (
                <div className="space-y-2">
                  {recentTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.6 + index * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <Link href="/groups/today">
                        <div className="border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-sm sm:text-base flex-1">
                              {task.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                              {task.description}
                            </p>
                          )}
                          {task.dueDate && (
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-8 sm:p-12 text-center">
                  <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No tasks yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get started by creating your first task
                  </p>
                  <Button onClick={() => setAddTaskOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </div>
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
      </main>
    </SidebarProvider>
  );
}
