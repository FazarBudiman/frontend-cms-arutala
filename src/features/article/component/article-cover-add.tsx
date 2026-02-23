import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { articleCoverInputSchema, ArticleCoverInputType } from "../type";
import { Textarea } from "@/components/ui/textarea";
import { useCreateArticleCover } from "../hook";


export function ArticleCoverAddDialog({articleId}: {articleId: string}) {
  const [open, setOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useCreateArticleCover(articleId)

  const handleCreate = async (values: ArticleCoverInputType) => {
    const formData = new FormData();
    formData.append("cover_description", values.cover_description);

    if (values.cover_image) {
      formData.append("cover_image", values.cover_image);
    }

    toast.promise(mutateAsync(formData), {
      loading: "Membuat cover article ...",
      success: () => {
        setOpen(false);
        form.reset();
        return "Membuat cover article berhasil";
      },
      error: (err) => err.message || "Gagal membuat cover article",
    });
  };

  useEffect(() => {
    return () => {
      if (previewLogo) URL.revokeObjectURL(previewLogo);
    };
  }, [previewLogo]);

  const form = useForm<ArticleCoverInputType>({
    resolver: zodResolver(articleCoverInputSchema),
    defaultValues: {
      cover_description: "",
      cover_image: undefined,
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <AlertDialogTrigger asChild>
        <Button size="sm">
          Add Cover Article <PlusCircle />
        </Button>
      </AlertDialogTrigger>

      {/* Content */}
      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit">
        {/* Header */}
        <AlertDialogHeader>
          <AlertDialogTitle>Add Cover Article</AlertDialogTitle>
          <AlertDialogDescription>Make changes here. Click save when you&apos;re done</AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />

        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
            <Controller
              name="cover_image"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <div className="md:col-span-2 gap-1">
                    <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start">
                      <FieldLabel htmlFor="cover_image">Cover Image</FieldLabel>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          field.onChange(file);
                          setPreviewLogo(URL.createObjectURL(file));
                        }}
                      />

                      {/* Preview */}
                      {previewLogo ? (
                        <div className="flex flex-row  items-center gap-4">
                          <div className="relative h-36 w-36 rounded-md overflow-hidden border">
                            <Image src={previewLogo} alt="user-profile" fill unoptimized className="object-contain" />
                          </div>

                          <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            Ganti Foto
                          </Button>
                        </div>
                      ) : (
                        /* Kalau belum ada profile */
                        <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
                          Upload Foto
                        </Button>
                      )}

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  </div>
                );
              }}
            />

            <Controller
              name="cover_description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cover_description">Description</FieldLabel>
                  <Textarea {...field} id="cover_description" aria-invalid={fieldState.invalid} autoComplete="off" className="w-full min-h-20"  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

          
          </div>

          {/* Footer */}
          <AlertDialogFooter className="flex w-full justify-between">
            <AlertDialogCancel asChild size="sm">
              <Button
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                  setPreviewLogo(null);
                }}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Creating.." : "Create Cover Article"}
            </Button>
            
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
