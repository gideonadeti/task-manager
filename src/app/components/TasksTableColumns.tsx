import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@prisma/client";
import formatDate from "../format-date";
import { Checkbox } from "@/components/ui/checkbox";
import TasksTableColumnHeader from "./TasksTableHeader";
import TasksTableActions from "./TasksTableActions";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <TasksTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const formattedPriority =
        priority.charAt(0).toUpperCase() + priority.slice(1);
      const priorityColor =
        {
          high: "text-red-500",
          medium: "text-yellow-500",
          low: "text-green-500",
        }[priority.toLowerCase()] || "text-gray-500";

      return <div className={priorityColor}>{formattedPriority}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <TasksTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as Date;
      const formattedDueDate = formatDate(dueDate);

      return <div>{formattedDueDate}</div>;
    },
  },
  {
    accessorKey: "completed",
    header: ({ column }) => (
      <TasksTableColumnHeader column={column} title="Completed" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <TasksTableActions row={row} />,
  },
];
