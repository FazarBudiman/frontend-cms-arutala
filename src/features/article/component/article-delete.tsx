import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useDeleteArticle } from "../hook";

export function ArticleDeleteDialog({ articleId }: { articleId: string }) {
  const { mutateAsync, isPending } = useDeleteArticle();

  const handleDelete = async () => {
    toast.promise(mutateAsync(articleId), {
      loading: "Menghapus artikel...",
      success: "Artikel berhasil dihapus",
      error: (err) => err.message || "Gagal menghapus artikel",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
          <TrashIcon className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-100">
            <TrashIcon className="text-red-500" />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus artikel ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin akan menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}