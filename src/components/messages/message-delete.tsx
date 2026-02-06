import { deleteMessageByIdAction } from "@/app/general/messages/action";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogMedia } from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

export function MessageDeleteDialog({ messageId }: { messageId: string }) {
  const handleDelete = async () => {
    try {
      await deleteMessageByIdAction(messageId);
      toast.success("Message deleted", { position: "top-center" });
      // TODO: trigger table refresh / mutate
    } catch {
      toast.error("Failed to delete message");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
          <TrashIcon className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-100">
            <TrashIcon className="text-red-500" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this message?</AlertDialogTitle>
          <AlertDialogDescription>Apakah kamu yakin akan menghapus pesan ini?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
