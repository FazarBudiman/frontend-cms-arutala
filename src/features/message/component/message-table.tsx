"use client";

import React, { useMemo } from "react";
import { DataTable, useTableState } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMessages } from "../hook";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";
import { getUniqueOptions } from "@/shared/utils/filter";
import { Message } from "../type";

const getRowId = (row: Message) => row.message_id;

export function MessageTable() {
  const { data: messages, isLoading } = useMessages();
  const table = useTableState(8);

  const subjectOptions = useMemo(() => {
    return getUniqueOptions(messages, "subject");
  }, [messages]);

  const statusOptions = useMemo(() => {
    return getUniqueOptions(messages, "message_status", formatSnakeCaseToTitle);
  }, [messages]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4 h-9">
        <Input placeholder="Search by name..." onChange={(e) => table.setColumnFilter("sender_name", e.target.value || null)} className="max-w-xs h-9 text-sm" />

        <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("message_status", v !== "ALL" ? v : null)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent position="popper" className="text-sm">
            <SelectGroup>
              <SelectItem value="ALL">All Status</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("subject", v !== "ALL" ? v : null)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Filter Subject" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="ALL">All Subject</SelectItem>
              {subjectOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={messages ?? []} columns={columns} getRowId={getRowId} isLoading={isLoading} {...table} />
    </div>
  );
}
