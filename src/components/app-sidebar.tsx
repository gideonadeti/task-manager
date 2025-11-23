"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import { isToday, isTomorrow, isThisWeek, isPast } from "date-fns";
import { Group } from "@prisma/client";
import {
  Inbox,
  Sun,
  Calendar,
  CalendarRange,
  AlertTriangle,
  FolderOpen,
  FolderClosed,
  MoreHorizontal,
  Plus,
  CheckCircle,
  LucideIcon,
} from "lucide-react";

import useGroups from "@/hooks/use-groups";
import useTasks from "@/hooks/use-tasks";
import AddGroup from "./add-group";
import DeleteDialog from "./delete-dialog";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "./ui/empty";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

type DefaultGroupConfig = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const DEFAULT_GROUPS: DefaultGroupConfig[] = [
  { name: "Inbox", href: "/groups/inbox", icon: Inbox },
  { name: "Today", href: "/groups/today", icon: Sun },
  { name: "Tomorrow", href: "/groups/tomorrow", icon: Calendar },
  { name: "This Week", href: "/groups/this-week", icon: CalendarRange },
  { name: "Overdue", href: "/groups/overdue", icon: AlertTriangle },
  { name: "Completed", href: "/groups/completed", icon: CheckCircle },
] as const;

type DefaultGroupName = (typeof DEFAULT_GROUPS)[number]["name"];

export function AppSidebar() {
  const { groupId } = useParams<{ groupId: string }>();
  const { groupsQuery } = useGroups();
  const { tasksQuery } = useTasks();
  const groups = useMemo(() => groupsQuery.data || [], [groupsQuery.data]);
  const tasks = useMemo(() => tasksQuery.data || [], [tasksQuery.data]);
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<Group | undefined>(undefined);
  const [groupDeleteId, setGroupDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const personalGroups = useMemo(
    () => groups.filter((group) => group.name !== "Inbox"),
    [groups]
  );

  const handleEdit = useCallback(
    (groupId: string) => {
      const group = groups.find((group) => group.id === groupId);

      if (group) {
        setGroup(group);
        setOpen(true);
      }
    },
    [groups]
  );

  const handleAdd = useCallback(() => {
    setGroup(undefined);
    setOpen(true);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + Alt/Option + G to add new group
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "g" &&
        (event.metaKey || event.ctrlKey) &&
        event.altKey &&
        !event.shiftKey
      ) {
        // Don't trigger if user is typing in an input field
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        event.preventDefault();
        handleAdd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAdd]);

  const handleDelete = useCallback((groupDeleteId: string) => {
    setGroupDeleteId(groupDeleteId);
    setOpenDelete(true);
  }, []);

  const getNumOfTasksDefault = useCallback(
    (groupName: DefaultGroupName): number => {
      if (!tasks.length) return 0;

      switch (groupName) {
        case "Inbox": {
          const inboxGroupId = groups.find((g) => g.name === "Inbox")?.id;
          if (!inboxGroupId) return 0;
          return tasks.filter(
            (task) => task.groupId === inboxGroupId && !task.completed
          ).length;
        }
        case "Today":
          return tasks.filter(
            (task) => task.dueDate && isToday(task.dueDate) && !task.completed
          ).length;
        case "Tomorrow":
          return tasks.filter(
            (task) =>
              task.dueDate && isTomorrow(task.dueDate) && !task.completed
          ).length;
        case "This Week":
          return tasks.filter(
            (task) =>
              task.dueDate && isThisWeek(task.dueDate) && !task.completed
          ).length;
        case "Overdue":
          return tasks.filter(
            (task) =>
              task.dueDate &&
              isPast(task.dueDate) &&
              !isToday(task.dueDate) &&
              !task.completed
          ).length;
        case "Completed":
          return tasks.filter((task) => task.completed).length;
        default:
          return 0;
      }
    },
    [tasks, groups]
  );

  const getNumOfTasksPersonal = useCallback(
    (groupId: string): number => {
      return tasks.filter((task) => task.groupId === groupId && !task.completed)
        .length;
    },
    [tasks]
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Default Groups</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DEFAULT_GROUPS.map((defaultGroup) => {
                const normalizedGroupId = groupId?.toString().toLowerCase();
                const normalizedGroupName = defaultGroup.name.toLowerCase();
                const isActive =
                  normalizedGroupId === normalizedGroupName ||
                  (normalizedGroupId === "this-week" &&
                    defaultGroup.name === "This Week");
                const numOfTasks = getNumOfTasksDefault(
                  defaultGroup.name as DefaultGroupName
                );
                const shouldAnimate = defaultGroup.name === "Today" && isActive;

                return (
                  <SidebarMenuItem key={defaultGroup.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={defaultGroup.href}>
                        <defaultGroup.icon
                          className={shouldAnimate ? "animate-spin" : ""}
                        />
                        <span>{defaultGroup.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {numOfTasks > 0 && (
                      <SidebarMenuBadge>
                        {numOfTasks > 99 ? "99+" : numOfTasks}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Personal Groups</SidebarGroupLabel>
          {groupsQuery.isPending ? (
            <>
              <SidebarGroupAction title="Add Group" onClick={handleAdd}>
                <Plus />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          ) : personalGroups.length === 0 ? (
            <SidebarGroupContent>
              <Empty className="border-0 p-4">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderOpen className="text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle className="text-sm">
                    No personal groups
                  </EmptyTitle>
                  <EmptyDescription className="text-xs">
                    Create a group to organize your tasks
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
              <SidebarGroupAction title="Add Group">
                <Plus onClick={handleAdd} />
              </SidebarGroupAction>
            </SidebarGroupContent>
          ) : (
            <>
              <SidebarGroupAction title="Add Group">
                <Plus onClick={handleAdd} />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {personalGroups.map((personalGroup) => {
                    const numOfTasks = getNumOfTasksPersonal(personalGroup.id);

                    return (
                      <SidebarMenuItem key={personalGroup.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={groupId === personalGroup.id}
                        >
                          <Link href={`/groups/${personalGroup.id}`}>
                            {groupId === personalGroup.id ? (
                              <FolderOpen />
                            ) : (
                              <FolderClosed />
                            )}
                            <span>{personalGroup.name}</span>
                          </Link>
                        </SidebarMenuButton>

                        {numOfTasks > 0 && (
                          <SidebarMenuBadge className="me-5">
                            {numOfTasks > 99 ? "99+" : numOfTasks}
                          </SidebarMenuBadge>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              <MoreHorizontal />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleEdit(personalGroup.id)}
                            >
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(personalGroup.id)}
                              className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                            >
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          )}
        </SidebarGroup>
      </SidebarContent>
      <AddGroup open={open} onOpenChange={setOpen} group={group} />
      <DeleteDialog
        type="group"
        deleteId={groupDeleteId}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </Sidebar>
  );
}
