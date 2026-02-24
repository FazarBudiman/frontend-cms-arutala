"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { articleCoverInputUpdateSchema, ArticleCoverInputUpdateType, ArticleDetail } from "../type";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateArticleCover } from "../hook";

export function ArticleCoverEditDialog({ articleDetail }: { articleDetail: ArticleDetail }) {
  const [open, setOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(articleDetail.article_cover_url || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useUpdateArticleCover(articleDetail.article_id);

  const handleUpdate = async (values: ArticleCoverInputUpdateType) => {
    const formData = new FormData();
    if (values.cover_description) {
      formData.append("cover_description", values.cover_description);
    }

    if (values.cover_image) {
      formData.append("cover_image", values.cover_image);
    }

    toast.promise(mutateAsync(formData), {
      loading: "Updating cover article ...",
      success: () => {
        setOpen(false);
        return "Cover article updated successfully";
      },
      error: (err) => err.message || "Failed to update cover article",
    });
  };

  const form = useForm<ArticleCoverInputUpdateType>({
    resolver: zodResolver(articleCoverInputUpdateSchema),
    defaultValues: {
      cover_description: articleDetail.article_cover_description || "",
      cover_image: undefined,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setPreviewLogo(articleDetail.article_cover_url || null);
      form.reset({
        cover_description: articleDetail.article_cover_description || "",
        cover_image: undefined,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (previewLogo && previewLogo !== articleDetail.article_cover_url) {
        URL.revokeObjectURL(previewLogo);
      }
    };
  }, [previewLogo, articleDetail.article_cover_url]);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          Edit Cover Article <Edit2Icon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Cover Article</AlertDialogTitle>
          <AlertDialogDescription>Change the cover image and description for this article.</AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />

        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
            <Controller
              name="cover_image"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <div className="md:col-span-2 gap-1">
                    <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start">
                      <FieldLabel htmlFor="cover_image">Cover Image</FieldLabel>

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

                      <div className="flex flex-row items-center gap-4">
                        {previewLogo && (
                          <div className="relative h-36 w-36 rounded-md overflow-hidden border">
                            <Image src={previewLogo} alt="cover-preview" fill unoptimized className="object-contain" />
                          </div>
                        )}

                        <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          {previewLogo ? "Ganti Foto" : "Upload Foto"}
                        </Button>
                      </div>

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
                  <Textarea {...field} id="cover_description" aria-invalid={fieldState.invalid} autoComplete="off" className="w-full min-h-20" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <AlertDialogFooter className="flex w-full justify-between">
            <AlertDialogCancel asChild size="sm">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
