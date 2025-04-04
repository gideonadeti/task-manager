interface NoTasksProps {
  groupId: string;
}

const NoTasks = ({ groupId }: NoTasksProps) => {
  switch (groupId) {
    case "inbox":
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <span className="font-semibold">Your peace of mind is priceless</span>
          <p>Well done! All your tasks are organized in the right place.</p>
        </div>
      );

    default:
      return null;
  }
};

export default NoTasks;
