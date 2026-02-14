import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogMedia } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useDeletePages } from "../hook";

export function PageDeleteDialog({ pageId }: { pageId: string }) {
  const { mutateAsync, isPending } = useDeletePages();

  const handleDelete = async () => {
    toast.promise(mutateAsync(pageId), {
      loading: "Menghapus page...",
      success: "Menghapus page",
      error: (err) => {
        return err.message || "Failed to delete testimoni";
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon-sm">
          <TrashIcon />
        </Button>
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
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
