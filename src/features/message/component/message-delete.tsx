import { useDeleteMessage } from "../hook";
import { DeleteDialog } from "@/components/shared/dialog-delete";

export function MessageDeleteDialog({ messageId }: { messageId: string }) {
  const { mutateAsync, isPending } = useDeleteMessage();
  return (
    <DeleteDialog
      variables={messageId}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this message"
      description="Apakah kamu yakin akan menghapus message ini?"
      loadingMessage="Menghapus message..."
      successMessage="Message berhasil dihapus"
      errorMessage="Gagal menghapus message"
    />
  );
}
