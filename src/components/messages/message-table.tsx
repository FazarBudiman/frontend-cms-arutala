"use client";

import React from "react";
import { Message } from "@/types/message";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MessageTable({ data }: { data: Message[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  const setNameFilter = (value: string) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== "sender_name");
      return value ? [...others, { id: "sender_name", value }] : others;
    });
  };

  const setStatusFilter = (value: string) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== "message_status");
      return value !== "ALL" ? [...others, { id: "message_status", value }] : others;
    });
  };

  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-4 ">
      {/* Toolbar */}
      <div className="flex items-center gap-4 ">
        {/* Search by name */}
        <Input placeholder="Search by name..." onChange={(e) => setNameFilter(e.target.value)} className="max-w-sm" />

        {/* Filter by status */}
        <Select defaultValue="ALL" onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent side="bottom" avoidCollisions={false}>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="NEW">NEW</SelectItem>
            <SelectItem value="CONTACTED">CONTACTED</SelectItem>
            <SelectItem value="QUALIFIED">QUALIFIED</SelectItem>
            <SelectItem value="NEGOTIATION">NEGOTIATION</SelectItem>
            <SelectItem value="PROPOSAL_SENT">PROPOSAL_SENT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable data={data} columns={columns} getRowId={(row) => row.message_id} sorting={sorting} columnFilters={filters} onSortingChange={setSorting} onColumnFiltersChange={setFilters} />
    </div>
  );
}
