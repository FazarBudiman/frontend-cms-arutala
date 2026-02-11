"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonTable } from "@/components/skeleton-table";
import { useCourses } from "../hook";

export function CourseTable() {
  const { data: courses, isLoading } = useCourses();
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
    const pageCount = Math.ceil((courses?.length ?? 0) / pagination.pageSize);

    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [courses, pagination.pageSize, pagination.pageIndex]);

  // Memoize opsi untuk dropdown
  // const uniqueExpertise = useMemo(() => {
  //   if (!courses) return [];
  //   const allExpertise = courses.flatMap((c) => c.contributor_expertise);
  //   return Array.from(new Set(allExpertise)).map((expert) => ({
  //     value: expert,
  //     label: expert,
  //   }));
  // }, [courses]);

  // const uniqueType = useMemo(() => {
  //   if (!courses) {
  //     return [];
  //   }
  //   return Array.from(new Set(courses.map((contributor) => contributor.contributor_type))).map((type) => ({
  //     value: type,
  //     label: type === "INTERNAL" ? "Mentor" : "Bukan Mentor",
  //   }));
  // }, [courses]);

  // Fungsi helper untuk update filter tanpa menghapus filter id lain
  // const setColumnFilter = (id: string, value: string | null) => {
  //   setFilters((prev) => {
  //     const others = prev.filter((f) => f.id !== id);
  //     return value ? [...others, { id, value }] : others;
  //   });
  // };

  if (isLoading) return <SkeletonTable />;

  return (
    <div className="space-y-4">
      {/* <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4"> */}
      {/* Search by Name: Mengisi filter array dengan id 'contributor_name' */}
      {/* <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("contributor_name", e.target.value)} className="max-w-sm" /> */}

      {/* Filter by Expertise: Mengisi filter array dengan id 'contributor_expertise' */}
      {/* <Select onValueChange={(v) => setColumnFilter("contributor_expertise", v !== "ALL" ? v : null)}>
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
          </Select> */}

      {/* Filter by Type */}
      {/* <Select onValueChange={(v) => setColumnFilter("contributor_type", v !== "ALL" ? v : null)}>
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
        </div>
        <ContributorAddDialog />
      </div> */}

      <DataTable
        data={courses ?? []}
        columns={columns}
        getRowId={(row) => row.course_id}
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
