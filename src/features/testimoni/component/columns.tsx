"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { TestimoniDeleteDialog } from "./testimoni-delete";
import { TestimoniDetailDialog } from "./testimoni-detail";
import { TestimoniProfileDialog } from "./testimoni-profile-dialog";
import { Testimoni } from "../type";

export const columns: ColumnDef<Testimoni>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    accessorKey: "author_profile_url",
    header: "Profile",
    cell: ({ row }) => <TestimoniProfileDialog testimoni={row.original} />,
  },
  {
    id: "author_name",
    accessorKey: "author_name",
    header: "Name",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.author_name}</span>
      </div>
    ),
  },
  {
    accessorKey: "author_job_title",
    header: "Job Title",
  },
  {
    accessorKey: "author_company_name",
    header: "Company Name",
  },
  // {
  //   accessorKey: "testimoni_content",
  //   header: "Testimoni",
  //   cell: ({ row }) => <div className="max-w-[320px] text-sm line-clamp-3">{row.original.testimoni_content}</div>,
  // },
  {
    accessorKey: "testimoni_category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        <Badge>{row.original.testimoni_category === "SISWA" ? "Siswa" : "Talent"}</Badge>
      </div>
    ),
  },

  {
    accessorKey: "is_displayed",
    header: "Status",
    enableColumnFilter: true,
    cell: ({ row }) => <Badge className={row.original.is_displayed ? "bg-success" : "bg-destructive"}>{row.original.is_displayed ? "Published" : "Unpublished"}</Badge>,
    filterFn: (row, columnId, value) => {
      if (value === null || value === undefined) return true;
      return String(row.getValue(columnId)) === String(value);
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ButtonGroup>
        <TestimoniDetailDialog testimoni={row.original} />
        <ButtonGroupSeparator />
        <TestimoniDeleteDialog testimoniId={row.original.testimoni_id} />
      </ButtonGroup>
    ),
  },
];
