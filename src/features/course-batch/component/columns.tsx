"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { formatedDate } from "@/shared/utils/date";
import { Button } from "@/components/ui/button";
import { IconListDetails } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { CourseBatch } from "../type";
import { CourseBatchDeleteDialog } from "./course-batch-delete";

export const columns = (courseId: string): ColumnDef<CourseBatch>[] => [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Title",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "registration_start",
    header: "Pendaftaran",
    cell: ({ row }) => {
      const registStart = formatedDate(row.original.registration_start);
      const registEnd = formatedDate(row.original.registration_end);
      return (
        <div>
          {registStart} - {registEnd}
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Pelaksanaan",
    cell: ({ row }) => {
      const start = formatedDate(row.original.start_date);
      const end = formatedDate(row.original.end_date);
      return (
        <div>
          {start} - {end}
        </div>
      );
    },
  },
  {
    accessorKey: "batch_status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        <Badge>{row.original.batch_status}</Badge>
      </div>
    ),
    filterFn: "arrIncludes",
  },
  {
    accessorKey: "instructor_name",
    header: "Instruktur",
  },
  {
    accessorKey: "base_price",
    header: "Harga",
    cell: ({ row }) => {
      const { base_price, discount_type, discount_value, final_price } = row.original;

      const hasDiscount = discount_value !== null && final_price !== null;

      const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(value);

      return (
        <div className="flex flex-col">
          {/* Final Price */}
          <span className="font-semibold">{formatCurrency(hasDiscount ? final_price : base_price)}</span>

          {/* Original Price (if discounted) */}
          {hasDiscount && <span className="text-xs line-through text-muted-foreground">{formatCurrency(base_price)}</span>}

          {/* Discount Label */}
          {hasDiscount && <span className="text-xs text-red-500 font-medium">{discount_type === "PERCENT" ? `${discount_value}% OFF` : `-${formatCurrency(discount_value)}`}</span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <ButtonGroup>
          <Button variant="outline" size="icon-sm" onClick={() => redirect(`/content-website/courses/${courseId}/batch/${row.original.course_batch_id}`)}>
            <IconListDetails />
          </Button>
          <ButtonGroupSeparator />
          <CourseBatchDeleteDialog courseId={courseId} batchId={row.original.course_batch_id} />
        </ButtonGroup>
      );
    },
  },
];
