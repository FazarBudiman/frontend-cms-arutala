"use client";

import React from "react";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { usePages } from "../hook";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { SkeletonTable } from "@/components/shared/skeleton-table";
import { Page } from "../type";

const getRowId = (row: Page) => row.page_id;

export function PageTable() {
  const { data: pages, isLoading } = usePages();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

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
          <Input placeholder="Search by page name..." onChange={(e) => setColumnFilter("page_title", e.target.value)} className="max-w-sm" />
        </div>
      </div>

      <DataTable
        data={pages ?? []}
        columns={columns}
        getRowId={getRowId}
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
