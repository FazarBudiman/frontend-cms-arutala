import { useDeleteUser } from "../hooks";
import { DeleteDialog } from "@/components/shared/dialog-delete";

export function UserDeleteDialog({ userId }: { userId: string }) {
  const { mutateAsync, isPending } = useDeleteUser();

  return (
    <DeleteDialog
      variables={userId}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this user"
      description="Apakah kamu yakin akan menghapus user ini?"
      loadingMessage="Menghapus user..."
      successMessage="User berhasil dihapus"
      errorMessage="Gagal menghapus user"
    />
  );
}
