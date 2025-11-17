"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Plus,
  ArrowRight,
  Sun,
  CalendarRange,
  Inbox,
  Edit,
  TrendingUp,
  TrendingDown,
  Clock,
  Flame,
  Target,
  BarChart3,
} from "lucide-react";
import {
  isToday,
  isTomorrow,
  isThisWeek,
  isPast,
  compareAsc,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";

import useTasks from "@/hooks/use-tasks";
import useGroups from "@/hooks/use-groups";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import formatRelativeTime from "../format-relative-time";
import { Task } from "@prisma/client";

// Dynamically import AddTask and TaskDetailsDialog to reduce initial bundle size
const AddTask = dynamic(() => import("@/components/add-task"), {
  loading: () => null,
});

const TaskDetailsDialog = dynamic(() => import("./TaskDetailsDialog"), {
  loading: () => null,
});

// Progress Ring Component
interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

function ProgressRing({
  percentage,
  size = 48,
  strokeWidth = 4,
  color = "currentColor",
  className = "",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const reducedMotion = useReducedMotion();

  return (
    <svg
      width={size}
      height={size}
      className={`transform -rotate-90 ${className}`}
      aria-label={`${percentage}% complete`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="opacity-20"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        initial={reducedMotion ? {} : { strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}

// Enhanced Stat Card with Progress Ring
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay?: number;
  percentage?: number;
  trend?: number;
  total?: number;
  tooltip?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
  percentage,
  trend,
  total,
  tooltip,
}: StatCardProps) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    const stepDuration = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [value, reducedMotion]);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="border rounded-lg p-4 sm:p-6 bg-card/50 backdrop-blur-sm hover:bg-card transition-all shadow-sm hover:shadow-md relative overflow-hidden group"
    >
      {/* Gradient background */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${
          color.split(" ")[0]
        }`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${color} shadow-sm`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="flex items-center gap-2">
            {trend !== undefined && trend !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  trend > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
            {percentage !== undefined && (
              <div className="relative">
                <ProgressRing
                  percentage={percentage}
                  size={48}
                  strokeWidth={4}
                  color={
                    color.includes("blue")
                      ? "#3b82f6"
                      : color.includes("yellow")
                      ? "#eab308"
                      : color.includes("red")
                      ? "#ef4444"
                      : "#22c55e"
                  }
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                  {percentage}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-bold">{displayValue}</span>
          {total !== undefined && (
            <span className="text-sm text-muted-foreground">/ {total}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
}

// Overall Progress Bar Component
interface OverallProgressProps {
  completed: number;
  total: number;
}

function OverallProgress({ completed, total }: OverallProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border rounded-lg p-4 sm:p-6 bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm sm:text-base">
            Overall Progress
          </span>
        </div>
        <span className="text-lg sm:text-xl font-bold">{percentage}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5 sm:h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={reducedMotion ? {} : { width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span>{completed} completed</span>
        <span>{total} total</span>
      </div>
    </motion.div>
  );
}

// Productivity Insights Component
interface ProductivityInsightsProps {
  tasks: Task[];
}

function ProductivityInsights({ tasks }: ProductivityInsightsProps) {
  const insights = useMemo(() => {
    const completedThisWeek = tasks.filter((task) => {
      if (!task.completed || !task.updatedAt) return false;
      const updated = new Date(task.updatedAt);
      return isThisWeek(updated);
    }).length;

    // Calculate streak (simplified - days with at least one completion)
    const completionDates = new Set(
      tasks
        .filter((task) => task.completed && task.updatedAt)
        .map((task) => format(new Date(task.updatedAt!), "yyyy-MM-dd"))
    );
    const streak = completionDates.size;

    // Most productive day (simplified - just show this week's pattern)
    const weekDays = eachDayOfInterval({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
    });
    const dayCounts = weekDays.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      return tasks.filter(
        (task) =>
          task.completed &&
          task.updatedAt &&
          format(new Date(task.updatedAt), "yyyy-MM-dd") === dayStr
      ).length;
    });
    const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const mostProductiveDay = format(weekDays[maxDayIndex], "EEEE");

    return {
      completedThisWeek,
      streak,
      mostProductiveDay,
    };
  }, [tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
      className="border rounded-lg p-4 sm:p-6 bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <H2 className="text-lg sm:text-xl">Productivity Insights</H2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This Week</p>
            <p className="text-lg font-bold">{insights.completedThisWeek}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="text-lg font-bold">{insights.streak} days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <Sun className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Most Active</p>
            <p className="text-lg font-bold">{insights.mostProductiveDay}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Task Card Component
interface TaskCardProps {
  task: Task;
  groups: Array<{ id: string; name: string }>;
  index: number;
  onTaskClick: (task: Task) => void;
}

function TaskCard({ task, groups, index, onTaskClick }: TaskCardProps) {
  const group = groups.find((g) => g.id === task.groupId);
  const isOverdue =
    task.dueDate &&
    isPast(new Date(task.dueDate)) &&
    !isToday(new Date(task.dueDate)) &&
    !task.completed;

  // Generate color from group name (deterministic)
  const getGroupColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
      "bg-teal-500",
      "bg-green-500",
      "bg-amber-500",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTaskClick(task);
    }
  };

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.6 + index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="group relative"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onTaskClick(task)}
        onKeyDown={handleKeyDown}
        className={`border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-all cursor-pointer min-h-[88px] sm:min-h-[100px] ${
          isOverdue ? "border-red-500/50 dark:border-red-400/50" : ""
        } ${isOverdue && !task.completed ? "animate-pulse" : ""}`}
        aria-label={`Task: ${task.title}`}
      >
        {/* Priority indicator bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
            priorityColors[task.priority]
          }`}
        />
        {/* Group color stripe */}
        {group && (
          <div
            className={`absolute top-0 right-0 w-1 h-full ${getGroupColor(
              group.name
            )} opacity-30`}
          />
        )}
        <div className="ml-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base flex-1 mb-1 line-clamp-1">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {group && (
                <Badge
                  variant="outline"
                  className="text-xs hidden sm:inline-flex"
                >
                  {group.name}
                </Badge>
              )}
              <Badge
                variant="outline"
                className={`text-xs ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                    : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                }`}
              >
                {task.priority}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span
                  className={
                    isOverdue
                      ? "text-red-600 dark:text-red-400 font-semibold"
                      : isToday(new Date(task.dueDate))
                      ? "text-orange-600 dark:text-orange-400 font-semibold"
                      : "text-muted-foreground"
                  }
                >
                  {formatRelativeTime(task.dueDate)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
                aria-label="View task details"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
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
          className="w-full justify-between h-auto p-4 hover:bg-accent transition-colors focus-visible:ring-2"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {count !== undefined && count > 0 && (
              <Badge variant="secondary" className="text-xs">
                {count}
              </Badge>
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);

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
              Welcome Back
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
