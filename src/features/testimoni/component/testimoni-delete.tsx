import { useDeleteTestimoni } from "../hook";
import { DeleteDialog } from "@/components/shared/dialog-delete";

export function TestimoniDeleteDialog({ testimoniId }: { testimoniId: string }) {
  const { mutateAsync, isPending } = useDeleteTestimoni();

  return (
    <DeleteDialog
      variables={testimoniId}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this testimoni"
      description="Apakah kamu yakin akan menghapus testimoni ini?"
      loadingMessage="Menghapus testimoni..."
      successMessage="Testimoni berhasil dihapus"
      errorMessage="Gagal menghapus testimoni"
    />
  );
}
