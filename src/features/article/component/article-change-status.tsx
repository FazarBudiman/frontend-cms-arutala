"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Article, articleStatusEnum, ArticleStatusType } from "../type";
import { useUpdateArticle } from "../hook";
import { useState } from "react";
import { statusColorArticle } from "./columns";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";

export function ArticleChangeStatusDialog({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);
  const [statusArticle, setStatusArticle] = useState<ArticleStatusType>(article.article_status);

  const { mutateAsync, isPending } = useUpdateArticle();

  const articleStatus = articleStatusEnum.options.map((status) => ({
    label: status,
    value: status,
  }));

  const handleUpdate = async () => {
    if (statusArticle === article.article_status) {
      toast.info("Status tidak berubah");
      return;
    }

    toast.promise(
      mutateAsync({
        articleId: article.article_id,
        body: { status: statusArticle },
      }),
      {
        loading: "Menyimpan perubahan…",
        success: () => {
          setOpen(false);
          return "Memperbarui pesan berhasil";
        },
        error: (err) => {
          setStatusArticle(article.article_status);
          return err.message || "Gagal memperbarui status";
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Change Status
        </Button>
      </AlertDialogTrigger>

      {/* Content */}
      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit">
        {/* Header */}
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Article Status</AlertDialogTitle>
          <AlertDialogDescription>Make changes here. Click save when you&apos;re done</AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />

        {/* Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
          {/* Status */}
          <Field className="md:col-span-1 gap-1">
            <FieldLabel>Status</FieldLabel>
            <Select value={statusArticle} onValueChange={(v: ArticleStatusType) => setStatusArticle(v)} disabled={isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {articleStatus.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <Badge className={statusColorArticle[status.value]}>{formatSnakeCaseToTitle(status.value)}</Badge>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="flex w-full justify-between">
          <AlertDialogCancel asChild size="sm">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </AlertDialogCancel>

          <Button type="submit" size="sm" onClick={handleUpdate} disabled={isPending}>
            {isPending ? "Saving" : "Save Changes"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
