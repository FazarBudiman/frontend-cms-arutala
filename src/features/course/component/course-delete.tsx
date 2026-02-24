import { useDeleteCourse } from "../hook";
import { DeleteDialog } from "@/components/shared/dialog-delete";

export function CourseDeleteDialog({ courseId }: { courseId: string }) {
  const { mutateAsync, isPending } = useDeleteCourse();

  return (
    <DeleteDialog
      variables={courseId}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this course"
      description="Apakah kamu yakin akan menghapus course ini?"
      loadingMessage="Menghapus course..."
      successMessage="Course berhasil dihapus"
      errorMessage="Gagal menghapus course"
    />
  );
}
