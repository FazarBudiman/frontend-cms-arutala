"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonTable } from "@/components/skeleton-table";
import { TestimoniAddDialog } from "./testimoni-add";
import { useTestimonies } from "../hook";

export function TestimoniTable() {
  const { data: testimonies, isLoading } = useTestimonies();
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
    const pageCount = Math.ceil((testimonies?.length ?? 0) / pagination.pageSize);

    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [testimonies, pagination.pageSize, pagination.pageIndex]);

  const uniqueCategory = useMemo(() => {
    if (!testimonies) {
      return [];
    }
    return Array.from(new Set(testimonies.map((testimoni) => testimoni.testimoni_category))).map((type) => ({
      value: type,
      label: type === "SISWA" ? "Siswa" : "Talent",
    }));
  }, [testimonies]);

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
          {/* Search by Name: Mengisi filter array dengan id 'contributor_name' */}
          <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("author_name", e.target.value)} className="max-w-sm" />

          {/* Filter by Type */}
          <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("testimoni_category", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Type" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Category</SelectItem>
                {uniqueCategory.map((category) => {
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

      <DataTable
        data={testimonies ?? []}
        columns={columns}
        getRowId={(row) => row.testimoni_id}
        sorting={sorting}
        columnFilters={filters}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setFilters}
      />
    </div>
  );
}
