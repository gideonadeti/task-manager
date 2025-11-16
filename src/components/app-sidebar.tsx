"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Group } from "@prisma/client";
import { useState } from "react";
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
} from "lucide-react";
import { isToday, isTomorrow, isThisWeek, isPast } from "date-fns";

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
} from "./ui/dropdown-menu";

const defaultGroups = [
  { name: "Inbox", href: "/groups/inbox", icon: Inbox },
  { name: "Today", href: "/groups/today", icon: Sun },
  { name: "Tomorrow", href: "/groups/tomorrow", icon: Calendar },
  { name: "This Week", href: "/groups/this-week", icon: CalendarRange },
  { name: "Overdue", href: "/groups/overdue", icon: AlertTriangle },
  { name: "Completed", href: "/groups/completed", icon: CheckCircle },
];

export function AppSidebar() {
  const { groupId } = useParams<{ groupId: string }>();
  const { groupsQuery } = useGroups();
  const { tasksQuery } = useTasks();
  const groups = groupsQuery.data || [];
  const tasks = tasksQuery.data || [];
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<Group | undefined>(undefined);
  const [groupDeleteId, setGroupDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const personalGroups = groups.filter((group) => group.name !== "Inbox");

  function handleEdit(groupId: string) {
    const group = groups.find((group) => group.id === groupId);

    if (group) {
      setGroup(group);
      setOpen(true);
    }
  }

  function handleAdd() {
    setGroup(undefined);
    setOpen(true);
  }

  function handleDelete(groupDeleteId: string) {
    setGroupDeleteId(groupDeleteId);
    setOpenDelete(true);
  }

  function getNumOfTasksDefault(groupName: string) {
    if (!tasks) return 0;

    switch (groupName) {
      case "Inbox": {
        const inboxGroupId = groups?.find(
          (group) => group.name === "Inbox"
        )?.id;
        return tasks
          .filter((task) => task.groupId === inboxGroupId)
          .filter((task) => !task.completed).length;
      }
      case "Today":
        return tasks
          .filter((task) => task.dueDate && isToday(task.dueDate))
          .filter((task) => !task.completed).length;
      case "Tomorrow":
        return tasks
          .filter((task) => task.dueDate && isTomorrow(task.dueDate))
          .filter((task) => !task.completed).length;
      case "This Week":
        return tasks
          .filter((task) => task.dueDate && isThisWeek(task.dueDate))
          .filter((task) => !task.completed).length;
      case "Overdue":
        return tasks
          .filter(
            (task) =>
              task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate)
          )
          .filter((task) => !task.completed).length;
      case "Completed":
        return tasks.filter((task) => task.completed).length;
      default:
        return 0;
    }
  }

  function getNumOfTasksPersonal(groupId: string) {
    return tasks
      ? tasks.filter((task) => task.groupId === groupId && !task.completed)
          .length
      : 0;
  }

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
                const numOfTasks = getNumOfTasksDefault(defaultGroup.name);

                return (
                  <SidebarMenuItem key={defaultGroup.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={defaultGroup.href}>
                        <defaultGroup.icon
                          className={`${
                            defaultGroup.name === "Today" && isActive
                              ? "animate-spin"
                              : ""
                          }`}
                        />
                        <span>{defaultGroup.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {numOfTasks > 0 && (
                      <SidebarMenuBadge>{numOfTasks}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
                            {numOfTasks}
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
                            <DropdownMenuItem
                              onClick={() => handleDelete(personalGroup.id)}
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
