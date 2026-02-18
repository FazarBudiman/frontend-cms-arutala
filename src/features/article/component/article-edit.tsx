"use client";

import { useRef, useMemo, useState } from "react";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import { z } from "zod";
import type { OutputData } from "@editorjs/editorjs";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArticleEditor, ArticleEditorHandle } from "./article-editor";
import { useArticleDetail, useUpdateArticle, useUploadArticleCover } from "../hook";
import { Article, ContentBlock } from "../type";

type ArticleEditSheetProps = {
  article: Article;
};

export function ArticleEditSheet({ article }: ArticleEditSheetProps) {
  const [open, setOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(article.article_status);

  const editorRef = useRef<ArticleEditorHandle>(null);

  const { data: articleDetail, isLoading } = useArticleDetail(article.article_id, {
    enabled: open,
  });

  const { mutateAsync: updateArticle, isPending: isUpdating } = useUpdateArticle();
  const { mutateAsync: uploadCover, isPending: isUploading } = useUploadArticleCover();

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("cover", file);

    toast.promise(uploadCover(formData), {
      loading: "Mengupload cover...",
      success: () => "Cover berhasil diupload",
      error: (err) => {
        setCoverPreview(null);
        return err.message || "Gagal mengupload cover";
      },
    });
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("cover", file);
    try {
      const result = await uploadCover(formData);
      return { success: 1, file: { url: result.url } };
    } catch {
      return { success: 0, file: { url: "" } };
    }
  };

  const handleSubmit = async () => {
    if (!editorRef.current) return;

    try {
      const outputData = await editorRef.current.save();
      const blocks = outputData.blocks.map((block) => ({
        id: block.id ?? "",
        type: block.type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: block.data as any,
      })) as z.infer<typeof ContentBlock>[];

      await toast.promise(
        updateArticle({
          articleId: article.article_id,
          body: { contentBlocks: blocks, status },
        }),
        {
          loading: "Menyimpan perubahan...",
          success: "Artikel berhasil diperbarui",
          error: (err) => err.message || "Gagal memperbarui artikel",
        },
      );

      setOpen(false);
    } catch {
      /* handled by toast.promise */
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setCoverPreview(null);
      setStatus(article.article_status);
    }
  };

  const currentCover = coverPreview ?? article.article_cover_url;

  const defaultEditorData: OutputData | undefined = useMemo(() => {
    if (!articleDetail) return undefined;
    return {
      time: 0,
      blocks: articleDetail.article_content_blocks.map((b) => ({
        id: b.id,
        type: b.type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: b.data as any,
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleDetail?.article_id]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconPencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
      </SheetTrigger>

      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl" showCloseButton>
        <SheetHeader>
          <SheetTitle>Edit Artikel</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 py-4">
          {/* Cover */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Cover Artikel</span>
            {currentCover ? (
              <div className="relative h-48 w-full">
                <Image
                  src={currentCover}
                  alt="cover"
                  fill
                  className="rounded-md object-cover"
                  unoptimized
                />
                <label className="absolute bottom-2 right-2 cursor-pointer rounded-md bg-black/60 px-3 py-1 text-xs text-white hover:bg-black/80">
                  Ganti Cover
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            ) : (
              <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input bg-muted/30 transition hover:bg-muted/50">
                <UploadCloud className="size-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isUploading ? "Mengupload..." : "Klik untuk upload cover"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Status</span>
            <Select value={status} onValueChange={(v) => setStatus(v as "DRAFT" | "PUBLISHED")}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Editor */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Konten Artikel</span>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center rounded-md border border-input">
                <span className="text-sm text-muted-foreground">Memuat konten...</span>
              </div>
            ) : (
              open && (
                <ArticleEditor
                  ref={editorRef}
                  holder={`article-edit-editor-${article.article_id}`}
                  defaultData={defaultEditorData}
                  onUploadImage={handleImageUpload}
                />
              )
            )}
          </div>
        </div>

        <SheetFooter className="flex flex-row justify-end gap-2 px-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating || isUploading || isLoading}
          >
            {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
