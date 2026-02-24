"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonTable } from "@/components/shared/skeleton-table";
import { useMessages } from "../hook";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";

export function MessageTable() {
  const { data: messages, isLoading } = useMessages();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  /* ------------------------------------------------------------------ */
  /* Derived options                                                      */
  /* ------------------------------------------------------------------ */

  const uniqueSubject = useMemo(() => {
    if (!messages) return [];
    return Array.from(new Set(messages.flatMap((m) => m.subject))).map((s) => ({
      value: s,
      label: s,
    }));
  }, [messages]);

  const uniqueStatuses = useMemo(() => {
    if (!messages) return [];
    return Array.from(new Set(messages.map((m) => m.message_status))).map((s) => ({
      value: s,
      label: formatSnakeCaseToTitle(s),
    }));
  }, [messages]);

  /* ------------------------------------------------------------------ */
  /* Handlers                                                             */
  /* ------------------------------------------------------------------ */

  /** Set filter */
  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4 h-9">
        {/* Search by name */}
        <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("sender_name", e.target.value || null)} className="max-w-xs h-9 text-sm" />

        {/* Filter by status */}
        <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("message_status", v !== "ALL" ? v : null)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent position="popper" className="text-sm">
            <SelectGroup>
              <SelectItem value="ALL">All Status</SelectItem>
              {uniqueStatuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Filter by Subject */}
        <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("subject", v !== "ALL" ? v : null)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Filter Subject" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="ALL">All Subject</SelectItem>
              {uniqueSubject.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          data={messages ?? []}
          columns={columns}
          getRowId={(row) => row.message_id}
          sorting={sorting}
          columnFilters={filters}
          pagination={pagination}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onColumnFiltersChange={setFilters}
        />
      )}
    </div>
  );
}
