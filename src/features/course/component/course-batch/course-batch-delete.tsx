import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogMedia } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useDeleteCourseBatch } from "../../hook";


export function CourseBatchDeleteDialog({ courseId, batchId }: { courseId: string, batchId: string }) {
  const { mutateAsync, isPending } = useDeleteCourseBatch();

  const handleDelete = async () => {
    toast.promise(mutateAsync({ courseId, batchId }), {
      loading: "Menghapus course batch...",
      success: "Menghapus course batch berhasil",
      error: (err) => {
        return err.message || "Failed to delete course batch";
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
          <AlertDialogTitle>Delete this course Batch?</AlertDialogTitle>
          <AlertDialogDescription>Apakah kamu yakin akan menghapus course batch ini?</AlertDialogDescription>
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
