"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ActionTable } from "@/components/action-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Course } from "../type";

export const columns: ColumnDef<Course>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  // {
  //   accessorKey: "",
  //   header: "Profile",
  //   cell: ({ row }) => (
  //     <Avatar>
  //       <AvatarImage src={row.original.contributor_profile_url} alt="user-profile" />
  //       <AvatarFallback>{row.original.contributor_name.charAt(0)}</AvatarFallback>
  //     </Avatar>
  //   ),
  // },
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
    accessorKey: "course_field_name",
    header: "Field",
  },
  {
    accessorKey: "course_description",
    header: "Description",
    cell: ({ row }) => <div className="max-w-[320px] text-sm line-clamp-3">{row.original.course_description}</div>,
  },

  // {
  //   accessorKey: "contributor_expertise",
  //   header: "Expertise",
  //   cell: ({ row }) => (
  //     <div className="flex gap-1 flex-wrap">
  //       {row.original.contributor_expertise.map((s) => (
  //         <Badge key={s} variant="secondary">
  //           {s}
  //         </Badge>
  //       ))}
  //     </div>
  //   ),
  //   filterFn: "arrIncludes",
  // },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionTable>
        <></>
        {/* <ContributorDetai1lSheet contributor={row.original} /> */}
        {/* <ContributorDetailDialog contributor={row.original} />
        <ContributorDeleteDialog contributorId={row.original.contributor_id} /> */}
      </ActionTable>
    ),
  },
];
