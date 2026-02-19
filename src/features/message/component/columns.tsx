"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageDeleteDialog } from "./message-delete";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";
import { MessageDetailDialog } from "./message-detail";
import { formatedDate } from "@/shared/utils/date";
import { generateWhatsAppMessage, generateWhatsAppNumber } from "@/shared/utils/whatsapp";
import { Message, MessageStatus } from "../type";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { IconBrandWhatsappFilled } from "@tabler/icons-react";

export const statusColor: Record<MessageStatus, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  QUALIFIED: "bg-green-500",
  NEGOTIATION: "bg-orange-500",
  PROPOSAL_SENT: "bg-purple-500",
  VERBAL_COMMITMENT: "bg-purple-700",
  CLOSED_WON: "bg-yellow-500",
  CLOSED_LOSS: "bg-orange-500",
  ON_HOLD: "bg-blue-500",
};

export const columns: ColumnDef<Message>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    accessorKey: "created_date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatedDate(row.original.created_date),
  },
  {
    id: "sender_name",
    accessorKey: "sender_name",
    header: "Name",
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: ({ row }) => {
      const WaPhone = generateWhatsAppNumber(row.original.sender_phone);
      const message = generateWhatsAppMessage(row.original.sender_name);
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.sender_name}</span>
          <span className="text-xs text-muted-foreground">
            <Link href={`https://wa.me/${WaPhone}?text=${message}`} target="_blank" rel="noopener noreferrer">
              {WaPhone}
            </Link>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "organization_name",
    header: "Institution",
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.subject.map((s) => (
          <Badge key={s} variant="secondary" className="text-xs">
            {s}
          </Badge>
        ))}
      </div>
    ),
    filterFn: "arrIncludes",
  },
  {
    accessorKey: "message_body",
    header: "Message",
    cell: ({ row }) => <div className="max-w-[320px] text-sm line-clamp-3">{row.original.message_body}</div>,
  },
  {
    accessorKey: "message_status",
    header: "Status",
    enableColumnFilter: true,
    cell: ({ row }) => <Badge className={cn("text-shadow-2xs", statusColor[row.original.message_status])}>{row.original.message_status}</Badge>,
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const WaPhone = generateWhatsAppNumber(row.original.sender_phone);
      const message = generateWhatsAppMessage(row.original.sender_name);
      return (
        <ButtonGroup>
          <Button size="icon-sm">
            <Link href={`https://wa.me/${WaPhone}?text=${message}`} target="_blank" rel="noopener noreferrer">
              <IconBrandWhatsappFilled />
            </Link>
          </Button>

          <ButtonGroupSeparator />
          <MessageDetailDialog message={row.original} />
          <ButtonGroupSeparator />
          <MessageDeleteDialog messageId={row.original.message_id} />
        </ButtonGroup>
      );
    },
  },
];
