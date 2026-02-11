"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { TestimoniDeleteDialog } from "./testimoni-delete";
import { TestimoniDetailDialog } from "./testimoni-detail";
import { Testimoni } from "../type";

export const columns: ColumnDef<Testimoni>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    accessorKey: "author_profile_url",
    header: "Profile",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.author_profile_url} alt="user-profile" />
        <AvatarFallback>{row.original.author_name.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "testimoni_category",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        <Badge>{row.original.testimoni_category.toLowerCase()}</Badge>
      </div>
    ),
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
  {
    accessorKey: "testimoni_content",
    header: "Testimoni",
    cell: ({ row }) => <div className="max-w-[320px] text-sm line-clamp-3">{row.original.testimoni_content}</div>,
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
      // <ActionTable>
      //   {/* <ContributorDetai1lSheet contributor={row.original} /> */}
      //   <ContributorDetailDialog contributor={row.original} />
      //   <ContributorDeleteDialog contributorId={row.original.contributor_id} />
      // </ActionTable>
    ),
  },
];
