import { User } from "@/features/user";
import { ColumnDef } from "@tanstack/react-table";
import { UserDeleteDialog } from "./user-delete";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";

export const column: ColumnDef<User>[] = [
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
    accessorKey: "user_profile_url",
    header: "Profile",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.user_profile_url} alt="user-profile" />
        <AvatarFallback>{row.original.username.charAt(0).toUpperCase()}</AvatarFallback>
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
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.role_name
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ButtonGroup>
        <UserDeleteDialog userId={row.original.user_id} />
      </ButtonGroup>
    ),
  },
];
