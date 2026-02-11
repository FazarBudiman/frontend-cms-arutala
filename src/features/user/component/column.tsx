import { User } from "@/features/user/type";
import { ColumnDef } from "@tanstack/react-table";
import { ActionTable } from "@/components/action-table";
import { UserDeleteDialog } from "./user-delete";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const column: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    accessorKey: "user_profile_url",
    header: "Profile",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.user_profile_url} alt="user-profile" />
        <AvatarFallback>{row.original.username.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role_name",
    header: "Role",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionTable>
        <UserDeleteDialog userId={row.original.user_id} />
      </ActionTable>
    ),
  },
];
