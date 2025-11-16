"use client";

import { motion, useReducedMotion } from "motion/react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  CheckCircle2,
  FolderTree,
  Calendar,
  Target,
  ArrowRight,
  Edit,
  Search,
  Shield,
  Smartphone,
} from "lucide-react";
import { H1 } from "../ui/CustomTags";
import { Button } from "@/components/ui/button";
import { ThemeToggler } from "@/components/theme-toggler";
import { Separator } from "@/components/ui/separator";
import { useRef, useState, useEffect } from "react";

const features = [
  {
    icon: FolderTree,
    title: "Organize with Groups",
    description:
      "Create custom groups to organize your tasks by project, category, or any way you prefer. Keep your workspace structured and find what you need instantly.",
  },
  {
    icon: Target,
    title: "Priority Levels",
    description:
      "Set priority levels (low, medium, high) to focus on what matters most. Visual indicators help you identify urgent tasks at a glance.",
  },
  {
    icon: Calendar,
    title: "Due Dates",
    description:
      "Never miss a deadline with due date tracking. Set deadlines for your tasks and stay on top of your schedule with visual date indicators.",
  },
  {
    icon: Edit,
    title: "Full CRUD Operations",
    description:
      "Complete task management with create, read, update, and delete operations. Edit task details, descriptions, and status with ease.",
  },
  {
    icon: CheckCircle2,
    title: "Task Completion",
    description:
      "Easily toggle task completion status. Track your progress and celebrate your achievements as you complete tasks.",
  },
  {
    icon: Search,
    title: "Search & Filter",
    description:
      "Quickly find tasks with powerful search functionality. Filter by priority, group, completion status, or due date to focus on what you need.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description:
      "Your data is protected with secure authentication powered by Clerk. Sign in safely and access your tasks from anywhere.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Access Taskflow seamlessly on any device. Beautiful, responsive design that works perfectly on desktop, tablet, and mobile.",
  },
];

export default function LandingPage() {
  const prefersReducedMotion = useReducedMotion();
  const featuresRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLightTheme = mounted && resolvedTheme === "light";

  // Smooth scroll to features section (accounting for sticky header)
  const scrollToFeatures = () => {
    if (featuresRef.current) {
      const headerOffset = 80; // Approximate header height
      const elementPosition = featuresRef.current.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
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

      {/* Header with Logo */}
      <header
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b"
        role="banner"
        aria-label="Site header"
      >
        <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Logo and Title - Left */}
          <motion.div
            className="relative inline-flex items-center gap-2"
            whileHover="hover"
            initial="initial"
          >
            <Link href="/" className="relative inline-flex items-center gap-2">
              {/* Background glow effect with Motion animation */}
              <motion.span
                className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 rounded-lg -z-10"
                variants={{
                  initial: { opacity: 0, scale: 0.95, filter: "blur(16px)" },
                  hover: {
                    opacity: 0.6,
                    scale: 1.05,
                    filter: "blur(24px)",
                  },
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
              />

              {/* Logo with scale/pulse animation */}
              <motion.div
                className="relative z-10"
                variants={{
                  initial: {
                    scale: 1,
                    filter: isLightTheme
                      ? "drop-shadow(0 0 0px rgba(59,130,246,0))"
                      : "drop-shadow(0 0 0px rgba(96,165,250,0))",
                  },
                  hover: {
                    scale: [1, 1.1, 1.05],
                    filter: isLightTheme
                      ? [
                          "drop-shadow(0 0 0px rgba(59,130,246,0))",
                          "drop-shadow(0 0 12px rgba(59,130,246,0.6))",
                          "drop-shadow(0 0 8px rgba(59,130,246,0.5))",
                        ]
                      : [
                          "drop-shadow(0 0 0px rgba(96,165,250,0))",
                          "drop-shadow(0 0 12px rgba(96,165,250,0.6))",
                          "drop-shadow(0 0 8px rgba(96,165,250,0.5))",
                        ],
                  },
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                {!mounted ? (
                  <div className="h-8 w-8" />
                ) : isLightTheme ? (
                  <Image
                    key="light"
                    src="/images/logo-light.png"
                    alt="Taskflow"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                    priority
                  />
                ) : (
                  <Image
                    key="dark"
                    src="/images/logo-dark.png"
                    alt="Taskflow"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                    priority
                  />
                )}
              </motion.div>

              {/* Main text with Motion gradient animation */}
              <motion.span
                className="relative z-10 block text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
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
                variants={{
                  initial: {
                    filter: isLightTheme
                      ? "drop-shadow(0 0 0px rgba(59,130,246,0))"
                      : "drop-shadow(0 0 0px rgba(96,165,250,0))",
                  },
                  hover: {
                    filter: isLightTheme
                      ? [
                          "drop-shadow(0 0 0px rgba(59,130,246,0))",
                          "drop-shadow(0 0 12px rgba(59,130,246,0.6))",
                          "drop-shadow(0 0 8px rgba(59,130,246,0.5))",
                        ]
                      : [
                          "drop-shadow(0 0 0px rgba(96,165,250,0))",
                          "drop-shadow(0 0 12px rgba(96,165,250,0.6))",
                          "drop-shadow(0 0 8px rgba(96,165,250,0.5))",
                        ],
                  },
                }}
              >
                Taskflow
              </motion.span>
            </Link>
          </motion.div>

          {/* Right Section - Learn More & Theme Toggle */}
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
      <main id="main-content" className="flex-1 flex flex-col" role="main">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-12 sm:gap-16 lg:gap-20 p-6 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full min-h-[70vh]">
          {/* Left Section - Hero Content */}
          <div className="flex-1 flex flex-col text-center md:text-left space-y-6 sm:space-y-8">
            {/* Hero Title */}
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
                  Streamline Your Workflow,
                </motion.span>
                <span className="block mt-3 sm:mt-4">Master Your Tasks</span>
              </H1>
            </motion.div>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(0.1)}
              className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed"
            >
              Taskflow is a modern, full-stack task management application that
              helps you organize your work, track priorities, and stay
              productive. Built with Next.js, TypeScript, and PostgreSQL for a
              seamless, reliable experience.
            </motion.p>

            {/* Optional CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(0.15)}
              className="flex items-center md:items-start gap-4 pt-2"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToFeatures}
                className="w-full sm:w-auto min-h-[44px] text-base px-8"
                aria-label="Learn more about features"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Right Section - Sign In (No Wrapper) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={getTransition(0.2)}
            className="flex-1 flex items-center justify-center w-full md:w-auto"
          >
            <div className="w-full max-w-md">
              <SignIn />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresRef}
          className="py-12 sm:py-16 lg:py-20 pb-20 sm:pb-24 lg:pb-28 px-6 sm:px-8 lg:px-12 bg-muted/30"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={getTransition()}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Powerful Features for{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Modern Productivity
                </span>
              </h2>
              <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
                Everything you need to manage your tasks efficiently and stay
                organized.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8 sm:mt-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={
                      prefersReducedMotion
                        ? { opacity: 1, y: 0 }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    whileHover={
                      prefersReducedMotion ? {} : { scale: 1.02, y: -2 }
                    }
                    className="flex flex-col gap-4 p-5 sm:p-6 rounded-xl border border-border bg-card hover:bg-card/80 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-default focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                    tabIndex={0}
                    role="article"
                    aria-label={`Feature: ${feature.title}`}
                  >
                    <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 w-fit">
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
            </div>
          </div>
        </section>
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
