"use client";

import React, { useMemo } from "react";
import { DataTable, useTableState } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourses } from "../hook";
import { getUniqueOptions } from "@/shared/utils/filter";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Course } from "../type";

const getRowId = (row: Course) => row.course_id;

export function CourseTable() {
  const { data: courses, isLoading } = useCourses();
  const table = useTableState(8);

  const categoryOptions = useMemo(() => {
    return getUniqueOptions(courses, "course_category_name");
  }, [courses]);

  const fieldOptions = useMemo(() => {
    return getUniqueOptions(courses, "course_field_name");
  }, [courses]);

  return (
    <div className="space-y-4">
      <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4">
          <Input placeholder="Search by name..." onChange={(e) => table.setColumnFilter("course_title", e.target.value)} className="max-w-sm" />

          {/* Filter by Category */}
          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("course_category_name", v !== "ALL" ? v : null)}>
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

          {/* Filter by Field */}
          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("course_field_name", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Field" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Field</SelectItem>
                {fieldOptions.map((field) => {
                  return (
                    <SelectItem value={field.value} key={field.value}>
                      {field.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* <CourseAddDialog /> */}
        <Button size="sm" onClick={() => redirect(`/content-website/courses/create`)}>
          Tambah Course <PlusCircle />
        </Button>
      </div>

      <DataTable data={courses ?? []} columns={columns} getRowId={getRowId} isLoading={isLoading} {...table} />
    </div>
  );
}
