"use client";

import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { CourseBatch } from "../../type";

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
  // console.log(courses);

  //   React.useEffect(() => {
  //     setPagination((prev) => ({
  //       ...prev,
  //       pageIndex: 0,
  //     }));
  //   }, [filters, sorting]);

  React.useEffect(() => {
    const pageCount = Math.ceil((batch?.length ?? 0) / pagination.pageSize);

    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [batch, pagination.pageSize, pagination.pageIndex]);

  //   const uniqueCategoryCourse = useMemo(() => {
  //     if (!courses) {
  //       return [];
  //     }
  //     return Array.from(new Set(courses.map((course) => course.course_category_name))).map((category) => ({
  //       value: category,
  //       label: category,
  //     }));
  //   }, [courses]);

  //   const uniqueFieldCourse = useMemo(() => {
  //     if (!courses) {
  //       return [];
  //     }
  //     return Array.from(new Set(courses.map((course) => course.course_field_name))).map((field) => ({
  //       value: field,
  //       label: field,
  //     }));
  //   }, [courses]);

  // Fungsi helper untuk update filter tanpa menghapus filter id lain
  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  //   if (isLoading) return <SkeletonTable />;

  return (
    <div className="space-y-4">
      <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4">
          {/* Search by Name: Mengisi filter array dengan id 'contributor_name' */}
          <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("name", e.target.value)} className="max-w-sm" />

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

          {/* Filter by Category */}
          {/* <Select onValueChange={(v) => setColumnFilter("course_category_name", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Category" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Category</SelectItem>
                {uniqueCategoryCourse.map((category) => {
                  return (
                    <SelectItem value={category.value} key={category.value}>
                      {category.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select> */}

          {/* Filter by Field */}
          {/* <Select onValueChange={(v) => setColumnFilter("course_field_name", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Field" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Field</SelectItem>
                {uniqueFieldCourse.map((field) => {
                  return (
                    <SelectItem value={field.value} key={field.value}>
                      {field.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>

        {/* <CourseAddDialog /> */}
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
