"use client";

import React, { useMemo } from "react";
import { DataTable, useTableState } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MitraAddDialog } from "./mitra-add";
import { useMitras } from "../hook";
import { getUniqueOptions } from "@/shared/utils/filter";
import { Mitra } from "../type";

const getRowId = (row: Mitra) => row.mitra_id;

export function MitraTable() {
  const { data: mitras, isLoading } = useMitras();
  const table = useTableState(6);

  const businessFieldOptions = useMemo(() => {
    return getUniqueOptions(mitras, "business_field");
  }, [mitras]);

  const statusOptions = useMemo(() => {
    return getUniqueOptions(mitras, "is_displayed", (val) => (val ? "Published" : "Unpublished"));
  }, [mitras]);

  console.log(mitras);

  return (
    <div className="space-y-4">
      <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4">
          <Input placeholder="Search by name..." onChange={(e) => table.setColumnFilter("mitra_name", e.target.value)} className="max-w-sm" />

          {/* Filter by Business Field */}
          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("business_field", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Field" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Field</SelectItem>
                {businessFieldOptions.map((field) => (
                  <SelectItem value={field.value} key={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filter by Status */}
          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("is_displayed", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem value={status.value} key={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <MitraAddDialog />
      </div>

      <DataTable data={mitras ?? []} columns={columns} getRowId={getRowId} isLoading={isLoading} pageSizeOptions={[6, 15, 30, 50]} {...table} />
    </div>
  );
}
