"use client";

import React, { useMemo } from "react";
import { DataTable, useTableState } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestimoniAddDialog } from "./testimoni-add";
import { useTestimonies } from "../hook";
import { getUniqueOptions } from "@/shared/utils/filter";
import { Testimoni } from "../type";

const getRowId = (row: Testimoni) => row.testimoni_id;

export function TestimoniTable() {
  const { data: testimonies, isLoading } = useTestimonies();
  const table = useTableState(8);

  const categoryOptions = useMemo(() => {
    return getUniqueOptions(testimonies, "testimoni_category", (type) => (type === "SISWA" ? "Siswa" : "Talent"));
  }, [testimonies]);

  return (
    <div className="space-y-4">
      <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4">
          <Input placeholder="Search by name..." onChange={(e) => table.setColumnFilter("author_name", e.target.value)} className="max-w-sm" />

          {/* Filter by Type */}
          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("testimoni_category", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Category" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Category</SelectItem>
                {categoryOptions.map((category) => {
                  return (
                    <SelectItem value={category.value} key={category.value}>
                      {category.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <TestimoniAddDialog />
      </div>

      <DataTable data={testimonies ?? []} columns={columns} getRowId={getRowId} isLoading={isLoading} {...table} />
    </div>
  );
}
