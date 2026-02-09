"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonTable } from "@/components/skeleton-table";
import { useContributors } from "@/hooks/use-contributor";

export function ContributorTable() {
  const { data: contributors, isLoading } = useContributors();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);

  // Memoize opsi untuk dropdown
  const uniqueSubject = useMemo(() => {
    if (!contributors) return [];
    const allExpertise = contributors.flatMap((c) => c.contributor_expertise);
    return Array.from(new Set(allExpertise)).map((expert) => ({
      value: expert,
      label: expert,
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
      <div className="flex items-center gap-4">
        {/* Search by Name: Mengisi filter array dengan id 'contributor_name' */}
        <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("contributor_name", e.target.value)} className="max-w-sm" />

        {/* Filter by Expertise: Mengisi filter array dengan id 'contributor_expertise' */}
        <Select onValueChange={(v) => setColumnFilter("contributor_expertise", v !== "ALL" ? v : null)}>
          <SelectTrigger className="w-50">
            <SelectValue placeholder="All Expertise" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="ALL">All Expertise</SelectItem>
              {uniqueSubject.map((expert) => (
                <SelectItem value={expert.value} key={expert.value}>
                  {expert.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={contributors ?? []}
        columns={columns}
        getRowId={(row) => row.contributor_id}
        sorting={sorting}
        columnFilters={filters} // State filters dilempar ke sini
        onSortingChange={setSorting}
        onColumnFiltersChange={setFilters}
      />
    </div>
  );
}
