"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonTable } from "@/components/skeleton-table";
import { ContributorAddDialog } from "./contributor-add";
import { useContributors } from "../hook";

export function ContributorTable() {
  const { data: contributors, isLoading } = useContributors();
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
    const pageCount = Math.ceil((contributors?.length ?? 0) / pagination.pageSize);

    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [contributors, pagination.pageSize, pagination.pageIndex]);

  // Memoize opsi untuk dropdown
  const uniqueExpertise = useMemo(() => {
    if (!contributors) return [];
    const allExpertise = contributors.flatMap((c) => c.contributor_expertise);
    return Array.from(new Set(allExpertise)).map((expert) => ({
      value: expert,
      label: expert,
    }));
  }, [contributors]);

  const uniqueType = useMemo(() => {
    if (!contributors) {
      return [];
    }
    return Array.from(new Set(contributors.map((contributor) => contributor.contributor_type))).map((type) => ({
      value: type,
      label: type === "INTERNAL" ? "Mentor" : "Bukan Mentor",
    }));
  }, [contributors]);

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
          <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("contributor_name", e.target.value)} className="max-w-sm" />

          {/* Filter by Type */}
          <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("contributor_type", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Type" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Type</SelectItem>
                {uniqueType.map((type) => {
                  return (
                    <SelectItem value={type.value} key={type.value}>
                      {type.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filter by Expertise: Mengisi filter array dengan id 'contributor_expertise' */}
          <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("contributor_expertise", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Expertise" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Expertise</SelectItem>
                {uniqueExpertise.map((expert) => (
                  <SelectItem value={expert.value} key={expert.value}>
                    {expert.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ContributorAddDialog />
      </div>

      <DataTable
        data={contributors ?? []}
        columns={columns}
        getRowId={(row) => row.contributor_id}
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
