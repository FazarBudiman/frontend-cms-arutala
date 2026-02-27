"use client";

import React, { useMemo } from "react";
import { DataTable, useTableState } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { usePages } from "../hook";
import { SkeletonTable } from "@/components/shared/skeleton-table";
import { Page } from "../type";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUniqueOptions } from "@/shared/utils/filter";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";

const getRowId = (row: Page) => row.page_id;

export function PageTable() {
  const { data: pages, isLoading } = usePages();
  const table = useTableState(8);

  const statusOptions = useMemo(() => {
    return getUniqueOptions(pages, "seo_status", formatSnakeCaseToTitle);
  }, [pages]);

  if (isLoading) return <SkeletonTable />;

  return (
    <div className="space-y-4">
      <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4">
          {/* Search by Name: Mengisi filter array dengan id 'contributor_name' */}
          <Input placeholder="Search by page name..." onChange={(e) => table.setColumnFilter("page_title", e.target.value)} className="max-w-sm" />

          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("seo_status", v !== "ALL" ? v : null)}>
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
        </div>
      </div>

      <DataTable data={pages ?? []} columns={columns} getRowId={getRowId} isLoading={isLoading} {...table} />
    </div>
  );
}
