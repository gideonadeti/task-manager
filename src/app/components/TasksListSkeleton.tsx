import { Skeleton } from "@/components/ui/skeleton";
import TaskCardSkeleton from "./TaskCardSkeleton";

export default function TasksListSkeleton() {
  return (
    <div className="h-full overflow-y-auto pb-14 space-y-4 px-2 md:px-4 lg:px-8 pt-4">
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <Skeleton className="h-8 w-[150px] lg:w-[250px] rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      {/* Task Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

