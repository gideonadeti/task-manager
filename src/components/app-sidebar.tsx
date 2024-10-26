"use client";

import {
  Inbox,
  Sun,
  Calendar,
  CalendarRange,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
} from "@/components/ui/sidebar";

// Default Groups
const defaultGroups = [
  {
    name: "Inbox",
    href: "/groups/inbox",
    icon: Inbox,
  },
  {
    name: "Today",
    href: "/groups/today",
    icon: Sun,
  },
  {
    name: "Tomorrow",
    href: "/groups/tomorrow",
    icon: Calendar,
  },
  {
    name: "This Week",
    href: "/groups/this-week",
    icon: CalendarRange,
  },
  {
    name: "Overdue",
    href: "/groups/overdue",
    icon: AlertTriangle,
  },
];

export function AppSidebar() {
  const { groupId } = useParams();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Default Groups</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {defaultGroups.map((defaultGroup) => {
                const isActive =
                  groupId === defaultGroup.name.toLowerCase() ||
                  (groupId === "this-week" &&
                    defaultGroup.name === "This Week");

                return (
                  <SidebarMenuItem key={defaultGroup.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={defaultGroup.href}>
                        <defaultGroup.icon />
                        <span>{defaultGroup.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Personal Groups</SidebarGroupLabel>
          <SidebarGroupAction title="Add Group">
            <Plus /> <span className="sr-only">Add Group</span>
          </SidebarGroupAction>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
