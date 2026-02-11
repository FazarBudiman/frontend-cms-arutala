"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonTable } from "@/components/skeleton-table";
import { useMessages } from "../hook";

export function MessageTable() {
  const { data: messages, isLoading } = useMessages();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters, sorting]);

  React.useEffect(() => {
    const pageCount = Math.ceil((messages?.length ?? 0) / pagination.pageSize);

    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [messages, pagination.pageSize, pagination.pageIndex]);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  const uniqueSubject = useMemo(() => {
    if (!messages) return [];
    const allExpertise = messages.flatMap((message) => message.subject);
    return Array.from(new Set(allExpertise)).map((subject) => ({
      value: subject,
      label: subject,
    }));
  }, [messages]);

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
      <div className="flex items-center gap-4 h-9 ">
        {/* Search by name */}
        <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("sender_name", e.target.value)} className="max-w-xs h-9 text-sm" />

        {/* Filter by status */}
        <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("message_status", v !== "ALL" ? v : null)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent position="popper" className="text-sm">
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

        {/* Filter by Subejct: Mengisi filter array dengan id 'subject' */}
        <Select onValueChange={(v) => setColumnFilter("subject", v !== "ALL" ? v : null)}>
          <SelectTrigger className="text-sm h-90">
            <SelectValue placeholder="All Subject" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="ALL">All Subject</SelectItem>
              {uniqueSubject.map((field) => (
                <SelectItem value={field.value} key={field.value}>
                  {field.label}
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
