import { useDeleteArticle } from "../hook";
import { DeleteDialog } from "@/components/dialog-delete";

export function ArticleDeleteDialog({ articleId }: { articleId: string }) {
  const { mutateAsync, isPending } = useDeleteArticle();

  return (
    <DeleteDialog
      variables={articleId}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this artikel"
      description="Apakah kamu yakin akan menghapus artikel ini?"
      loadingMessage="Menghapus artikel..."
      successMessage="Artikel berhasil dihapus"
      errorMessage="Gagal menghapus artikel"
    />
  );
}
