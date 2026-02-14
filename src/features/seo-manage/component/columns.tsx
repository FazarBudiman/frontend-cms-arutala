"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";

import { Page } from "../type";
import { PageDeleteDialog } from "./page-delete";

export const columns: ColumnDef<Page>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    id: "parent_page_title",
    accessorKey: "parent_page_title",
    header: "Parent Page",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.parent_page_title !== null && row.original.parent_page_title}</span>
      </div>
    ),
  },
  {
    id: "page_title",
    accessorKey: "page_title",
    header: "Name",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.page_title}</span>
      </div>
    ),
  },
  {
    accessorKey: "page_slug",
    header: "Page Slug",
  },
  // {
  //   accessorKey: "author_company_name",
  //   header: "Company Name",
  // },
  // {
  //   accessorKey: "testimoni_content",
  //   header: "Testimoni",
  //   cell: ({ row }) => <div className="max-w-[320px] text-sm line-clamp-3">{row.original.testimoni_content}</div>,
  // },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ButtonGroup>
        <PageDeleteDialog pageId={row.original.page_id} />
      </ButtonGroup>
      // <ActionTable>
      //   {/* <ContributorDetai1lSheet contributor={row.original} /> */}
      //   <ContributorDetailDialog contributor={row.original} />
      //   <ContributorDeleteDialog contributorId={row.original.contributor_id} />
      // </ActionTable>
    ),
  },
];
