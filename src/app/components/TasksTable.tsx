"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import TaskTablePagination from "./TasksTablePagination";
import TasksTableToolbar from "./TasksTableToolbar";
import { Task } from "@prisma/client";

interface TasksTableProps {
  data: Task[];
}

export function TasksTable({ data }: TasksTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Minimal columns definition only for filtering
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "priority",
        header: "Priority",
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <div className="h-screen overflow-y-auto pb-14 space-y-4 px-2 md:px-4 lg:px-8 pt-4">
      <TasksTableToolbar table={table} />
      <TaskTablePagination table={table} />
    </div>
  );
}
