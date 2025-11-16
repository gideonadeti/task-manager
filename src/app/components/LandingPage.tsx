"use client";

import { motion } from "motion/react";
import { SignIn } from "@clerk/nextjs";
import { CheckCircle2, FolderTree, Calendar, Target } from "lucide-react";
import { H1, H3 } from "../ui/CustomTags";

const features = [
  {
    icon: FolderTree,
    title: "Organize with Groups",
    description:
      "Create custom groups to organize your tasks by project, category, or any way you prefer.",
  },
  {
    icon: Target,
    title: "Priority Levels",
    description:
      "Set priority levels (low, medium, high) to focus on what matters most.",
  },
  {
    icon: Calendar,
    title: "Due Dates",
    description:
      "Never miss a deadline with due date tracking and smart reminders.",
  },
  {
    icon: CheckCircle2,
    title: "Task Management",
    description:
      "Full CRUD functionality to create, update, and complete tasks effortlessly.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-svh flex flex-col relative">
      {/* Header */}
      <div className="px-2 sm:px-4 py-2 sm:py-4">
        <H3 className="text-base sm:text-lg">Taskflow</H3>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Left Section - Hero Content */}
        <div className="flex-1 flex flex-col text-center md:text-left space-y-6 sm:space-y-8">
          {/* Hero Title with Gradient Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <H1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
              <motion.span
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{
                  backgroundPosition: "0% 50%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                Organize Your Life,
              </motion.span>
              <span className="block mt-2">One Task at a Time</span>
            </H1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-muted-foreground font-semibold text-base sm:text-lg lg:text-xl max-w-2xl"
          >
            A simple, intuitive task manager that keeps you on track and boosts
            productivity.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.1,
                    ease: "easeOut",
                  }}
                  className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Section - Sign In */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex-1 flex items-center justify-center w-full md:w-auto"
        >
          <div className="relative w-full max-w-md">
            {/* Background glow effect */}
            <motion.div
              className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-blue-400/20 rounded-2xl -z-10"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <div className="relative bg-card border border-border rounded-lg p-6 sm:p-8 shadow-lg">
              <SignIn />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}
