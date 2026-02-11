import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogMedia } from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useDeleteMessage } from "../hook";

export function MessageDeleteDialog({ messageId }: { messageId: string }) {
  const { mutateAsync, isPending } = useDeleteMessage();

  const handleDelete = async () => {
    toast.promise(mutateAsync(messageId), {
      loading: "Menghapus pesan...",
      success: "Menghapus pesan berhasil",
      error: (err) => {
        return err.message || "Failed to delete message";
      },
    });
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
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
