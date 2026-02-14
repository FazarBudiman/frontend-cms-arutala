"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Course } from "../type";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { CourseDeleteDialog } from "./course-delete";
import { IconListDetails } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const columns: ColumnDef<Course>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    id: "course_title",
    accessorKey: "course_title",
    header: "Title",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.course_title}</span>
      </div>
    ),
  },
  {
    accessorKey: "course_category_name",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        <Badge>{row.original.course_category_name}</Badge>
      </div>
    ),
    filterFn: "arrIncludes",
  },
  {
    accessorKey: "course_field_name",
    header: "Field",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ButtonGroup>
        <Link href={`/content-website/courses/${row.original.course_id}`}>
          <Button variant="outline" size="icon-sm">
            <IconListDetails />
          </Button>
        </Link>
        <ButtonGroupSeparator />
        <CourseDeleteDialog courseId={row.original.course_id} />
      </ButtonGroup>
    ),
  },
];
