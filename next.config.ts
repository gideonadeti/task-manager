import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports - reduces bundle size significantly for Radix UI
    optimizePackageImports: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "date-fns",
    ],
  },
};

export default nextConfig;
