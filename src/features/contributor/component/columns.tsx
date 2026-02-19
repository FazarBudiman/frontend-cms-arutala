"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContributorDeleteDialog } from "./contributor-delete";
import { ContributorDetailDialog } from "./contributor-detail";
import { Contributor } from "../type";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";

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
    accessorKey: "contributor_type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        <Badge>{row.original.contributor_type === "INTERNAL" ? "Mentor" : "Bukan Mentor"}</Badge>
      </div>
    ),
    filterFn: "arrIncludes",
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
      <ButtonGroup>
        <ContributorDetailDialog contributor={row.original} />
        <ButtonGroupSeparator />
        <ContributorDeleteDialog contributorId={row.original.contributor_id} />
      </ButtonGroup>
    ),
  },
];
