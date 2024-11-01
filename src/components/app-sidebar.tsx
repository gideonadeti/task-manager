"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Group, Task } from "@prisma/client";
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

import AddTask from "./add-task";
import AddGroup from "./add-group";
import DeleteGroup from "./delete-group";
import { Button } from "./ui/button";
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
  SidebarFooter,
  SidebarMenuAction,
  SidebarMenuBadge,
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
  const { groupId } = useParams() as { groupId: string };
  const { data: groups } = useQuery<Group[]>({ queryKey: ["groups"] });
  const { data: tasks } = useQuery<Task[]>({ queryKey: ["tasks"] });
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupUpdateId, setGroupUpdateId] = useState("");
  const [groupDeleteId, setGroupDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const personalGroups =
    groups?.filter((group) => group.name !== "Inbox") || [];

  function handleEdit(groupName: string, groupUpdateId: string) {
    setGroupName(groupName);
    setGroupUpdateId(groupUpdateId);
    setOpen(true);
  }

  function handleAdd() {
    setGroupName("");
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
        return tasks.filter((task) => task.groupId === inboxGroupId).length;
      }
      case "Today":
        return tasks.filter((task) => task.dueDate && isToday(task.dueDate))
          .length;
      case "Tomorrow":
        return tasks.filter((task) => task.dueDate && isTomorrow(task.dueDate))
          .length;
      case "This Week":
        return tasks.filter((task) => task.dueDate && isThisWeek(task.dueDate))
          .length;
      case "Overdue":
        return tasks.filter(
          (task) =>
            task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate)
        ).length;
      case "Completed":
        return tasks.filter((task) => task.completed).length;
      default:
        return 0;
    }
  }

  function getNumOfTasksPersonal(groupId: string) {
    return tasks ? tasks.filter((task) => task.groupId === groupId).length : 0;
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
                        <defaultGroup.icon />
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
                          onClick={() =>
                            handleEdit(personalGroup.name, personalGroup.id)
                          }
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={() => setOpenAdd(true)}>Add Task</Button>
        <AddTask open={openAdd} setOpen={setOpenAdd} />
        <AddGroup
          open={open}
          onOpenChange={setOpen}
          defaultValue={groupName}
          groupUpdateId={groupUpdateId}
        />
        <DeleteGroup
          open={openDelete}
          onOpenChange={setOpenDelete}
          groupDeleteId={groupDeleteId}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
