"use client";

import React, { useMemo } from "react";
import { Message } from "@/types/message";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "../ui/field";

export function MessageTable({ data }: { data: Message[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  const uniqueStatuses = useMemo(() => [...new Set(data.map((d) => d.message_status))], [data]);

  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  // const setNameFilter = (value: string) => {
  //   setFilters((prev) => {
  //     const others = prev.filter((f) => f.id !== "sender_name");
  //     return value ? [...others, { id: "sender_name", value }] : others;
  //   });
  // };

  // const setStatusFilter = (value: string) => {
  //   setFilters((prev) => {
  //     const others = prev.filter((f) => f.id !== "message_status");
  //     return value !== "ALL" ? [...others, { id: "message_status", value }] : others;
  //   });
  // };

  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-4 ">
      {/* Toolbar */}
      <div className="flex items-center gap-4 ">
        {/* Search by name */}
        {/* <Input placeholder="Search by name..." onChange={(e) => setNameFilter(e.target.value)} className="max-w-sm" /> */}
        <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("sender_name", e.target.value)} className="max-w-sm" />

        {/* Filter by status */}

        <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("message_status", v !== "ALL" ? v : null)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="ALL">All Status</SelectItem>
              {uniqueStatuses.map((status) => {
                return (
                  <SelectItem value={status} key={status}>
                    {status}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable data={data} columns={columns} getRowId={(row) => row.message_id} sorting={sorting} columnFilters={filters} onSortingChange={setSorting} onColumnFiltersChange={setFilters} />
    </div>
  );
}
