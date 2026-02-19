import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogMedia } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

interface DeleteDialogProps<TVariables> {
  variables: TVariables;
  onDelete: (variables: TVariables) => Promise<unknown>;
  isPending?: boolean;

  title?: string;
  description?: string;

  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function DeleteDialog<TVariables>({
  variables,
  onDelete,
  isPending,
  title = "Delete this item?",
  description = "Apakah kamu yakin ingin menghapus data ini?",
  loadingMessage = "Menghapus data...",
  successMessage = "Data berhasil dihapus",
  errorMessage = "Gagal menghapus data",
}: DeleteDialogProps<TVariables>) {
  const handleDelete = async () => {
    toast.promise(onDelete(variables), {
      loading: loadingMessage,
      success: successMessage,
      error: (err) => err?.message || errorMessage,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon-sm">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-100 ">
            <TrashIcon className="text-red-500" />
          </AlertDialogMedia>

          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
