"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { MitraDeleteDialog } from "./mitra-delete";
import { MitraDetailDialog } from "./mitra-detail";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Mitra } from "../type";

export const columns: ColumnDef<Mitra>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    accessorKey: "mitra_logo_url",
    header: "Logo",
    cell: ({ row }) => (
      <div className="w-full max-w-sm">
        <AspectRatio ratio={4 / 2} className="bg-accent rounded-lg border">
          <Image src={row.original.mitra_logo_url} alt={row.original.mitra_name} fill className="object-contain p-2" />
        </AspectRatio>
      </div>
    ),
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
