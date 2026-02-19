"use client";

import React from "react";
import { DataTable } from "@/components/data-table";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { CourseBatch } from "../type";
import { columns } from "./columns";

type CourseBatchProps = {
  batch: CourseBatch[];
  courseId: string;
};

export function CourseBatchTable({ batch, courseId }: CourseBatchProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  React.useEffect(() => {
    const pageCount = Math.ceil((batch?.length ?? 0) / pagination.pageSize);

    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [batch, pagination.pageSize, pagination.pageIndex]);

  // Fungsi helper untuk update filter tanpa menghapus filter id lain
  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  return (
    <div className="space-y-4">
      <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4">
          {/* Search by Name: Mengisi filter array dengan id 'contributor_name' */}
          <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("name", e.target.value)} className="max-w-sm" />
        </div>
      </div>

      <DataTable
        data={batch ?? []}
        columns={columns(courseId)}
        getRowId={(row) => row.name}
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
