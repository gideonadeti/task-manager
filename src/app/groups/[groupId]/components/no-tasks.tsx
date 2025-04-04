import { useUser } from "@clerk/nextjs";

interface NoTasksProps {
  groupId: string;
}

const NoTasks = ({ groupId }: NoTasksProps) => {
  const { user } = useUser();

  switch (groupId) {
    case "inbox":
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <span className="font-semibold">Your peace of mind is priceless</span>
          <p>Well done! All your tasks are organized in the right place.</p>
        </div>
      );

    case "today":
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <span className="font-semibold">
            You&#39;re all done for today, {user?.firstName}
          </span>
          <p>Enjoy the rest of your day!</p>
        </div>
      );
    case "tomorrow":
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <span className="font-semibold">
            You&#39;re all set for tomorrow, {user?.firstName}
          </span>
          <p>No tasks are due tomorrow.</p>
        </div>
      );

    case "this-week":
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <span className="font-semibold">
            You&#39;re all set for this week, {user?.firstName}
          </span>
          <p>No tasks are due this week.</p>
        </div>
      );

    case "overdue":
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <span className="font-semibold">
            You&#39;re all caught up, {user?.firstName}
          </span>
          <p>No overdue tasks.</p>
        </div>
      );

    case "completed":
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <span className="font-semibold">
            You&#39;re a task-crushing machine, {user?.firstName}
          </span>
          <p>Nothing to see here.</p>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <span className="font-semibold">No tasks here yet</span>
          <p>Create a task to get started!</p>
        </div>
      );
  }
};

export default NoTasks;
