"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonGroup } from "@/components/ui/button-group";
import { Page } from "../type";
import { PageDeleteDialog } from "./page-delete";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconListDetails } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";

export const columns: ColumnDef<Page>[] = [
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
    header: "Page Name",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="max-w-xs whitespace-normal wrap-break-words">
        <span className="font-medium">{row.original.page_title}</span>
      </div>
    ),
  },
  {
    accessorKey: "page_slug",
    header: "Page Slug",
  },
  {
    id: "seo_status",
    accessorKey: "seo_status",
    header: "SEO Status",
    cell: ({ row }) => <Badge>{formatSnakeCaseToTitle(row.original.seo_status)}</Badge>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" asChild>
          <Link href={`/general/seo-manage/${row.original.page_id}`}>
            <IconListDetails />
          </Link>
        </Button>
        {row.original.parent_page_title !== null && <PageDeleteDialog pageId={row.original.page_id} />}
      </ButtonGroup>
    ),
  },
];
