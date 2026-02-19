"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonTable } from "@/components/skeleton-table";
import { MitraAddDialog } from "./mitra-add";
import { useMitras } from "../hook";

export function MitraTable() {
  const { data: mitras, isLoading } = useMitras();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 6,
  });

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters, sorting]);

  React.useEffect(() => {
    const pageCount = Math.ceil((mitras?.length ?? 0) / pagination.pageSize);

    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [mitras, pagination.pageSize, pagination.pageIndex]);

  // Memoize opsi untuk dropdown
  const uniqueBusinessField = useMemo(() => {
    if (!mitras) return [];
    const allExpertise = mitras.flatMap((c) => c.business_field);
    return Array.from(new Set(allExpertise)).map((expert) => ({
      value: expert,
      label: expert,
    }));
  }, [mitras]);

  // Fungsi helper untuk update filter tanpa menghapus filter id lain
  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  if (isLoading) return <SkeletonTable />;

  return (
    <div className="space-y-4">
      <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4">
          {/* Search by Name: Mengisi filter array dengan id 'mitra_name' */}
          <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("mitra_name", e.target.value)} className="max-w-sm" />

          {/* Filter by Expertise: Mengisi filter array dengan id 'business_field' */}
          <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("business_field", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Field" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Field</SelectItem>
                {uniqueBusinessField.map((field) => (
                  <SelectItem value={field.value} key={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <MitraAddDialog />
      </div>

      <DataTable
        data={mitras ?? []}
        columns={columns}
        getRowId={(row) => row.mitra_id}
        sorting={sorting}
        pageSizeOptions={[6, 15, 30, 50]}
        columnFilters={filters}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setFilters}
      />
    </div>
  );
}
