"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Optimized QueryClient with better caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds (reduces unnecessary refetches)
      staleTime: 30 * 1000,
      // Cache data for 5 minutes after it's no longer used
      gcTime: 5 * 60 * 1000,
      // Don't refetch when window regains focus (better UX for task management)
      refetchOnWindowFocus: false,
      // Retry failed requests once
      retry: 1,
      // Retry after 1 second on failure
      retryDelay: 1000,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export default function QCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
