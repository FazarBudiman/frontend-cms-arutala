"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMessages } from "@/hooks/use-message";
import { SkeletonTable } from "@/components/skeleton-table";

export function MessageTable() {
  const { data: messages, isLoading } = useMessages();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  const uniqueStatuses = useMemo(() => {
    if (!messages) return [];

    return Array.from(new Set(messages.map((m) => m.message_status))).map((status) => ({
      value: status,
      label: status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [messages]);

  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-4 ">
      {/* Toolbar */}
      <div className="flex items-center gap-4 ">
        {/* Search by name */}
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
                  <SelectItem value={status.value} key={status.value}>
                    {status.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}

      {isLoading ? <SkeletonTable /> : <DataTable data={messages ?? []} columns={columns} getRowId={(row) => row.message_id} sorting={sorting} columnFilters={filters} onSortingChange={setSorting} onColumnFiltersChange={setFilters} />}
    </div>
  );
}
