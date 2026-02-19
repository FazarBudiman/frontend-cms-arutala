import { DeleteDialog } from "@/components/dialog-delete";
import { useDeleteCourseBatch } from "../hook";

export function CourseBatchDeleteDialog({ courseId, batchId }: { courseId: string; batchId: string }) {
  const { mutateAsync, isPending } = useDeleteCourseBatch();

  return (
    <DeleteDialog
      variables={{ courseId, batchId }}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this contributor"
      description="Apakah kamu yakin akan menghapus contributor ini?"
      loadingMessage="Menghapus contributor..."
      successMessage="Contributor berhasil dihapus"
      errorMessage="Gagal menghapus contributor"
    />
  );
}
