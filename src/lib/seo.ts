import type { Metadata } from "next";

export const siteConfig = {
  name: "Taskflow",
  description:
    "A modern, full-stack task management application built with Next.js, featuring authentication, CRUD operations, and intuitive task organization. Organize your tasks into groups, set priorities, track due dates, and boost your productivity.",
  url: "https://gideonadeti-taskflow.vercel.app",
  ogImage: "/opengraph-image",
  links: {
    github: "https://github.com/gideonadeti",
    linkedin: "https://linkedin.com/in/gideonadeti",
    twitter: "https://x.com/gideonadeti0",
    email: "mailto:gideonadeti0@gmail.com",
  },
  creator: "Gideon Adeti",
  keywords: [
    "task management",
    "productivity",
    "todo app",
    "task organizer",
    "project management",
    "task tracker",
    "productivity app",
    "task manager",
    "todo list",
    "task planning",
    "workflow management",
    "task prioritization",
    "due date tracking",
    "group organization",
  ],
};

export function generateMetadata({
  title,
  description,
  image,
  path = "",
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
} = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} - Modern Task Management App`;

  const pageDescription = description || siteConfig.description;
  const pageImage = image || `${siteConfig.url}${siteConfig.ogImage}`;
  const pageUrl = `${siteConfig.url}${path}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: pageTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: pageDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: "@gideonadeti0",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/favicon.ico",
    },
  };
}

export function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: siteConfig.creator,
      url: siteConfig.links.github,
    },
    featureList: [
      "Secure Authentication",
      "Organize with Groups",
      "Edit & Manage Tasks",
      "Priority Levels",
      "Due Dates",
      "Task Completion",
      "Search & Filter",
      "Responsive Design",
    ],
    softwareVersion: "1.0",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
  };
}
