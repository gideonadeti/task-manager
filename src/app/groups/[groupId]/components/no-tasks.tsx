import { useUser } from "@clerk/nextjs";
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
} from "@/components/ui/empty";

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
    </Empty>
  );
};

export default NoTasks;
