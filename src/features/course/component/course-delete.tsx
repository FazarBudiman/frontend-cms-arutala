import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogMedia } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useDeleteCourse } from "../hook";

export function CourseDeleteDialog({ courseId }: { courseId: string }) {
  const { mutateAsync, isPending } = useDeleteCourse();

  const handleDelete = async () => {
    toast.promise(mutateAsync(courseId), {
      loading: "Menghapus course...",
      success: "Menghapus course berhasil",
      error: (err) => {
        return err.message || "Failed to delete course";
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
          <AlertDialogTitle>Delete this course?</AlertDialogTitle>
          <AlertDialogDescription>Apakah kamu yakin akan menghapus course ini?</AlertDialogDescription>
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
