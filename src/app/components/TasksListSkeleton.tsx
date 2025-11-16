"use client";

import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import TaskCardSkeleton from "./TaskCardSkeleton";

export default function TasksListSkeleton() {
  return (
    <div className="flex-1 px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
      {/* Page Title Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Skeleton className="h-8 sm:h-9 w-32 mb-2" />
      </motion.div>

      {/* Task Count Text Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
        className="mb-4 sm:mb-6"
      >
        <Skeleton className="h-4 w-24" />
      </motion.div>

      <motion.div
        className="h-full overflow-y-auto pb-14 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        {/* Toolbar Skeleton */}
        <motion.div
          className="flex items-center justify-between gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex flex-1 items-center space-x-2">
            <Skeleton className="h-8 w-[150px] lg:w-[250px] rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
          <Skeleton className="h-8 w-32 rounded-md" />
        </motion.div>

        {/* Task Cards Skeleton */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
