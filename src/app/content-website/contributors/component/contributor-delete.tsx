import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogMedia } from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteUser } from "@/hooks/use-user";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

export function ContributorDeleteDialog({ contribitorId }: { contribitorId: string }) {
  //   const { mutateAsync, isPending } = useDeleteUser();

  const handleDelete = async () => {
    // toast.promise(mutateAsync(contribitorId), {
    //   loading: "Menghapus pesan...",
    //   success: (res) => {
    //     if (!res.success) {
    //       throw new Error(res.message);
    //     }
    //     return res.message;
    //   },
    //   error: (err) => {
    //     return err.message || "Failed to delete message";
    //   },
    // });
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
          <AlertDialogTitle>Delete this contributor?</AlertDialogTitle>
          <AlertDialogDescription>Apakah kamu yakin akan menghapus contributor ini?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
            {/* {isPending ? "Deleting..." : "Delete"} */}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
