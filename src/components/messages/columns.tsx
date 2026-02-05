"use client";
import { Message, MessageStatus } from "@/types/message";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { AlertDialogDelete } from "../alert-dialog-delete";
// import { UseDeleteMessage } from "@/hooks/mutations/use-delete-message";

export const statusColor: Record<MessageStatus, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  QUALIFIED: "bg-green-500",
  NEGOTIATION: "bg-orange-500",
  PROPOSAL_SENT: "bg-purple-500",
};

export const columns: ColumnDef<Message>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    accessorKey: "created_date",
    // header: "Date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.original.created_date).toLocaleDateString("id-ID"),
  },
  {
    id: "sender_name",
    accessorKey: "sender_name",
    header: "Name",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.sender_name}</span>
        <span className="text-xs text-muted-foreground">{row.original.sender_email}</span>
      </div>
    ),
  },
  {
    accessorKey: "sender_phone",
    header: "Phone Number",
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
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "message_body",
    header: "Message",
  },
  {
    accessorKey: "message_status",
    header: "Status",
    enableColumnFilter: true,
    cell: ({ row }) => <Badge className={statusColor[row.original.message_status]}>{row.original.message_status}</Badge>,
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      // const mutation = UseDeleteMessage();
      const messageId = row.original.message_id;
      return <div className="flex gap-4 flex-wrap">{/* <AlertDialogDelete resourceTitle="Message" identifiers={row.original.sender_name} onConfirm={() => mutation.mutate(messageId)} isLoading={mutation.isPending} /> */}</div>;
    },
  },
];
