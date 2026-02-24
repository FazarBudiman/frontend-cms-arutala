import { useDeleteMitra } from "../hook";
import { DeleteDialog } from "@/components/shared/dialog-delete";

export function MitraDeleteDialog({ mitraId }: { mitraId: string }) {
  const { mutateAsync, isPending } = useDeleteMitra();

  return (
    <DeleteDialog
      variables={mitraId}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this mitra"
      description="Apakah kamu yakin akan menghapus mitra ini?"
      loadingMessage="Menghapus mitra..."
      successMessage="Mitra berhasil dihapus"
      errorMessage="Gagal menghapus mitra"
    />
  );
}
