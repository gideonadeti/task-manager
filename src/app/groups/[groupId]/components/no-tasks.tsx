import { useUser } from "@clerk/nextjs";
import { Sun } from "lucide-react";

interface NoTasksProps {
  groupId: string;
}

interface MessageConfig {
  title: string;
  description: string;
  includeUserName?: boolean;
}

const NoTasks = ({ groupId }: NoTasksProps) => {
  const { user } = useUser();

  const messages: Record<string, MessageConfig> = {
    inbox: {
      title: "Your peace of mind is priceless",
      description:
        "Well done! All your tasks are organized in the right place.",
    },
    today: {
      title: "You're all done for today",
      description: "Enjoy the rest of your day!",
      includeUserName: true,
    },
    tomorrow: {
      title: "You're all set for tomorrow",
      description: "No tasks are due tomorrow.",
      includeUserName: true,
    },
    "this-week": {
      title: "You're all set for this week",
      description: "No tasks are due this week.",
      includeUserName: true,
    },
    overdue: {
      title: "You're all caught up",
      description: "No overdue tasks.",
      includeUserName: true,
    },
    completed: {
      title: "You're a task-crushing machine",
      description: "Nothing to see here.",
      includeUserName: true,
    },
  };

  const defaultMessage: MessageConfig = {
    title: "No tasks here yet",
    description: "Create a task to get started!",
  };

  const { title, description, includeUserName } =
    messages[groupId] || defaultMessage;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      {groupId === "today" && <Sun className="w-8 h-8 animate-bounce" />}
      <span className="font-semibold">
        {title}
        {includeUserName ? `, ${user?.firstName}` : ""}
      </span>
      <p>{description}</p>
    </div>
  );
};

export default NoTasks;
