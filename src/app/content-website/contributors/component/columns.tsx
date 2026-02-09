"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ActionTable } from "@/components/action-table";
import { Contributor } from "@/types/contributor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContributorDeleteDialog } from "./contributor-delete";
import { ContributorDetailSheet } from "./contributor-detail";

export const columns: ColumnDef<Contributor>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    accessorKey: "contributor_profile_url",
    header: "Profile",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.contributor_profile_url} alt="user-profile" />
        <AvatarFallback>{row.original.contributor_name.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    id: "contributor_name",
    accessorKey: "contributor_name",
    header: "Name",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.contributor_name}</span>
      </div>
    ),
  },
  {
    accessorKey: "contributor_job_title",
    header: "Job Title",
  },
  {
    accessorKey: "contributor_company_name",
    header: "Company Name",
  },
  {
    accessorKey: "contributor_expertise",
    header: "Expertise",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.contributor_expertise.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
    ),
    filterFn: "arrIncludes",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionTable>
        <ContributorDetailSheet contributor={row.original} />
        <ContributorDeleteDialog contribitorId={row.original.contributor_id} />
      </ActionTable>
    ),
  },
];
