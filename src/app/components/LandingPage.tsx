"use client";

import { motion, useReducedMotion } from "motion/react";
import { SignIn } from "@clerk/nextjs";
import {
  CheckCircle2,
  FolderTree,
  Calendar,
  Target,
  ArrowRight,
} from "lucide-react";
import { H1, H3 } from "../ui/CustomTags";
import { Button } from "@/components/ui/button";
import { ThemeToggler } from "@/components/theme-toggler";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";

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
  const prefersReducedMotion = useReducedMotion();
  const featuresRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle reduced motion preference
  const getTransition = (delay = 0) => {
    if (prefersReducedMotion) {
      return { duration: 0.01, delay };
    }
    return { duration: 0.6, ease: "easeOut" as const, delay };
  };

  return (
    <div className="min-h-svh flex flex-col relative">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Enhanced Header */}
      <header
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b"
        role="banner"
        aria-label="Site header"
      >
        <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={getTransition()}
          >
            <H3 className="text-base sm:text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Taskflow
            </H3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={getTransition()}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToFeatures}
              className="hidden sm:flex items-center gap-1.5"
              aria-label="Learn more about features"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <ThemeToggler />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 sm:gap-16 lg:gap-20 p-6 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full"
        role="main"
      >
        {/* Left Section - Hero Content */}
        <div className="flex-1 flex flex-col text-center md:text-left space-y-8 sm:space-y-10 lg:space-y-12">
          {/* Hero Title with Enhanced Gradient Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getTransition()}
          >
            <H1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
              <motion.span
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{
                  backgroundPosition: "0% 50%",
                }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }
                }
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                Organize Your Life,
              </motion.span>
              <span className="block mt-3 sm:mt-4">One Task at a Time</span>
            </H1>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getTransition(0.1)}
            className="text-muted-foreground font-semibold text-lg sm:text-xl lg:text-2xl max-w-2xl leading-relaxed"
          >
            A simple, intuitive task manager that keeps you on track and boosts
            productivity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getTransition(0.15)}
            className="flex flex-col sm:flex-row items-center md:items-start gap-4 pt-4"
          >
            <Button
              size="lg"
              onClick={scrollToFeatures}
              className="w-full sm:w-auto min-h-[44px] text-base px-8 group"
              aria-label="Get started with Taskflow"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToFeatures}
              className="w-full sm:w-auto min-h-[44px] text-base px-8"
              aria-label="Learn more about features"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Features Grid with Scroll Animation */}
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getTransition(0.2)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mt-12 sm:mt-16 lg:mt-20"
            aria-label="Features"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileInView={
                    prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }
                  }
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={
                    prefersReducedMotion ? {} : { scale: 1.02, y: -2 }
                  }
                  className="flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-default focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                  tabIndex={0}
                  role="article"
                  aria-label={`Feature: ${feature.title}`}
                >
                  <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon
                      className="h-6 w-6 sm:h-7 sm:w-7 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Section - Enhanced Sign In */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={getTransition(0.3)}
          className="flex-1 flex items-center justify-center w-full md:w-auto"
        >
          <div className="relative w-full max-w-md">
            {/* Enhanced Background glow effect */}
            <motion.div
              className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-blue-400/30 rounded-2xl -z-10"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.08, 1],
                    }
              }
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <div
              className="relative bg-card border-2 border-border rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              role="region"
              aria-label="Sign in to Taskflow"
            >
              <SignIn />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Enhanced Decorative Elements with Reduced Motion Support */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                  scale: [1, 1.2, 1],
                }
          }
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, -50, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1],
                }
          }
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
