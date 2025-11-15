"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Sun,
  Inbox,
  Calendar,
  CalendarRange,
  AlertTriangle,
  CheckCircle,
  FolderOpen,
} from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import AddTask from "@/components/add-task";
import useGroups from "@/hooks/use-groups";

interface NoTasksProps {
  groupId: string;
}

interface MessageConfig {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  includeUserName?: boolean;
}

const NoTasks = ({ groupId }: NoTasksProps) => {
  const { user } = useUser();
  const { groupsQuery } = useGroups();
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  // Special views that don't have a single group
  const specialViews = ["today", "tomorrow", "this-week", "overdue", "completed"];
  const isValidGroup = !specialViews.includes(groupId);

  // Get the actual group ID
  const getActualGroupId = (): string | undefined => {
    if (!isValidGroup) return undefined;
    
    if (groupId === "inbox") {
      return groupsQuery.data?.find((group) => group.name === "Inbox")?.id;
    }
    
    // For actual group IDs (UUIDs), return as is
    return groupId;
  };

  const actualGroupId = getActualGroupId();

  const messages: Record<string, MessageConfig> = {
    inbox: {
      title: "Your peace of mind is priceless",
      description:
        "Well done! All your tasks are organized in the right place.",
      icon: Inbox,
    },
    today: {
      title: "You're all done for today",
      description: "Enjoy the rest of your day!",
      icon: Sun,
      includeUserName: true,
    },
    tomorrow: {
      title: "You're all set for tomorrow",
      description: "No tasks are due tomorrow.",
      icon: Calendar,
      includeUserName: true,
    },
    "this-week": {
      title: "You're all set for this week",
      description: "No tasks are due this week.",
      icon: CalendarRange,
      includeUserName: true,
    },
    overdue: {
      title: "You're all caught up",
      description: "No overdue tasks.",
      icon: AlertTriangle,
      includeUserName: true,
    },
    completed: {
      title: "You're a task-crushing machine",
      description: "Nothing to see here.",
      icon: CheckCircle,
      includeUserName: true,
    },
  };

  const defaultMessage: MessageConfig = {
    title: "No tasks here yet",
    description: "Create a task to get started!",
    icon: FolderOpen,
  };

  const { title, description, icon: Icon, includeUserName } =
    messages[groupId] || defaultMessage;

  const displayTitle = includeUserName
    ? `${title}, ${user?.firstName || ""}`
    : title;

  return (
    <>
      <Empty className="h-full border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon
              className={`${
                groupId === "today" ? "animate-bounce" : ""
              } text-muted-foreground`}
            />
          </EmptyMedia>
          <EmptyTitle>{displayTitle}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        {isValidGroup && actualGroupId && (
          <EmptyContent>
            <Button onClick={() => setAddTaskOpen(true)}>
              Add Task
            </Button>
          </EmptyContent>
        )}
      </Empty>
      {isValidGroup && actualGroupId && (
        <AddTask
          open={addTaskOpen}
          setOpen={setAddTaskOpen}
          defaultGroupId={actualGroupId}
        />
      )}
    </>
  );
};

export default NoTasks;
