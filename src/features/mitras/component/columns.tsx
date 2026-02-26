"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MitraDeleteDialog } from "./mitra-delete";
import { MitraDetailDialog } from "./mitra-detail";
import { MitraLogoDialog } from "./mitra-logo-dialog";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Mitra } from "../type";

export const columns: ColumnDef<Mitra>[] = [
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
    accessorKey: "mitra_logo_url",
    header: "Logo",
    cell: ({ row }) => <MitraLogoDialog mitra={row.original} />,
  },
  {
    id: "mitra_name",
    accessorKey: "mitra_name",
    header: "Name",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.mitra_name}</span>
      </div>
    ),
  },

  {
    accessorKey: "business_field",
    header: "Business Field",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.business_field.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
    ),
    filterFn: "arrIncludes",
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
        <MitraDetailDialog mitra={row.original} />
        <ButtonGroupSeparator />
        <MitraDeleteDialog mitraId={row.original.mitra_id} />
      </ButtonGroup>
    ),
  },
];
