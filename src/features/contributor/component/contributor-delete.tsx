import { useDeleteContributor } from "../hook";
import { DeleteDialog } from "@/components/shared/dialog-delete";

export function ContributorDeleteDialog({ contributorId }: { contributorId: string }) {
  const { mutateAsync, isPending } = useDeleteContributor();

  return (
    <DeleteDialog
      variables={contributorId}
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
