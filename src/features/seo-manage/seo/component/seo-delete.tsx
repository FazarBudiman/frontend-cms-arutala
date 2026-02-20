import { DeleteDialog } from "@/components/dialog-delete";
import { useDeleteSeo } from "../hook";

export function SeoDeleteDialog({ seoId, pageId }: { seoId: string; pageId: string }) {
  const { mutateAsync, isPending } = useDeleteSeo();

  return (
    <DeleteDialog
      variables={{ pageId: pageId, seoId: seoId }}
      onDelete={mutateAsync}
      isPending={isPending}
      title="Delete this SEO"
      description="Apakah kamu yakin akan menghapus SEO ini?"
      loadingMessage="Menghapus SEO..."
      successMessage="SEO berhasil dihapus"
      errorMessage="Gagal menghapus SEO"
    />
  );
}
