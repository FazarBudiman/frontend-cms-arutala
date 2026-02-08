import { Message } from "@/types/message";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { MessageDetailSheet } from "./message-detail";
import { MessageDeleteDialog } from "./message-delete";

export function MessageActions({ message }: { message: Message }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <MessageDetailSheet message={message} />
        <MessageDeleteDialog messageId={message.message_id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
