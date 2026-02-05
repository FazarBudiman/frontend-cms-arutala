"use client";
import { User } from "@/types/user";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import React from "react";
import { column } from "./column";
import { DataTable } from "../data-table";
import { Input } from "../ui/input";

export function UserTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const setNameFilter = (value: string) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== "username");
      return value ? [...others, { id: "username", value }] : others;
    });
  };

  //   const setStatusFilter = (value: string) => {
  //     setFilters((prev) => {
  //       const others = prev.filter((f) => f.id !== "message_status");
  //       return value !== "ALL" ? [...others, { id: "message_status", value }] : others;
  //     });
  //   };

  return (
    <div className="space-y-4 ">
      {/* Toolbar */}
      <div className="flex items-center gap-4 ">
        {/* Search by name */}
        <Input placeholder="Search by name..." onChange={(e) => setNameFilter(e.target.value)} className="max-w-sm" />
      </div>

      {/* Table */}
      <DataTable data={data} columns={column} getRowId={(row) => row.user_id} sorting={sorting} columnFilters={filters} onSortingChange={setSorting} onColumnFiltersChange={setFilters} />
    </div>
  );
}
