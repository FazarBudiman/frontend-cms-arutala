import { useDeletePages } from "../hook";
import { DeleteDialog } from "@/components/dialog-delete";

export function PageDeleteDialog({ pageId }: { pageId: string }) {
  const { mutateAsync, isPending } = useDeletePages();

  return (
    <DeleteDialog
      variables={pageId}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this page"
      description="Apakah kamu yakin akan menghapus page ini?"
      loadingMessage="Menghapus page..."
      successMessage="Page berhasil dihapus"
      errorMessage="Gagal menghapus page"
    />
  );
}
