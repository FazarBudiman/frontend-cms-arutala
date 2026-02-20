"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, UploadCloud, X } from "lucide-react";
import { IconPencil } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { useUpdateArticle, useUploadArticleCover, usePatchArticleCover } from "../hook";
import { Article } from "../type";

type ArticleStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "UNPUBLISHED";

type ArticleEditSheetProps = {
  article: Article;
};

export function ArticleEditSheet({ article }: ArticleEditSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Meta fields
  const [title, setTitle] = useState(article.article_title);
  const [status, setStatus] = useState<ArticleStatus>(article.article_status as ArticleStatus);

  // Cover fields
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverDescription, setCoverDescription] = useState(
    article.article_cover_description ?? "",
  );

  const { mutateAsync: updateArticle, isPending: isUpdating } = useUpdateArticle();
  const { mutateAsync: uploadCover, isPending: isUploading } = useUploadArticleCover();
  const { mutateAsync: patchCover, isPending: isPatching } = usePatchArticleCover();

  const isPending = isUpdating || isUploading || isPatching;
  const hasCover = !!(article.article_cover_url || coverPreview);

  // Use null when empty string to avoid passing src="" to <img>
  const displayCover = coverPreview ?? (article.article_cover_url || null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const validate = (): string | null => {
    if (!title.trim()) return "Judul artikel wajib diisi";
    if (title.trim().length < 10) return "Judul minimal 10 karakter";
    if (coverFile && coverDescription.trim().length < 20)
      return "Deskripsi cover minimal 20 karakter";
    return null;
  };

  const handleSaveMeta = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    try {
      // PATCH /article/{id} — title required, additionalProperties: false
      await updateArticle({
        articleId: article.article_id,
        body: { title: title.trim(), status },
      });

      // Upload/update cover if a new file was selected
      if (coverFile) {
        const formData = new FormData();
        formData.append("cover_image", coverFile);
        formData.append("cover_description", coverDescription.trim());

        if (article.article_cover_url) {
          // Article already has a cover — use PATCH
          await patchCover({ articleId: article.article_id, formData });
        } else {
          // No existing cover — use POST
          await uploadCover({ articleId: article.article_id, formData });
        }
      } else if (article.article_cover_url && coverDescription.trim() !== (article.article_cover_description ?? "")) {
        // Only description changed (no new file)
        const formData = new FormData();
        formData.append("cover_description", coverDescription.trim());
        await patchCover({ articleId: article.article_id, formData });
      }

      toast.success("Artikel berhasil diperbarui");
      setOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal memperbarui artikel";
      toast.error(message);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setTitle(article.article_title);
      setStatus(article.article_status as ArticleStatus);
      setCoverFile(null);
      setCoverPreview(null);
      setCoverDescription(article.article_cover_description ?? "");
    }
  };



  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconPencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
      </SheetTrigger>

      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg" showCloseButton>
        <SheetHeader>
          <SheetTitle>Edit Artikel</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 py-4">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Judul Artikel <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Masukkan judul artikel (min. 10 karakter)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {title.length > 0 && title.length < 10 && (
              <p className="text-xs text-destructive">{title.length}/10 karakter minimum</p>
            )}
          </div>

          {/* Cover */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Cover Artikel{hasCover ? " (Ganti Cover)" : " (opsional)"}
            </span>
            {displayCover ? (
              <div className="relative h-48 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayCover} alt="cover" className="h-full w-full rounded-md object-cover" />
                <label className="absolute bottom-2 right-2 cursor-pointer rounded-md bg-black/60 px-3 py-1 text-xs text-white hover:bg-black/80">
                  Ganti Cover
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverChange} />
                </label>
                {coverFile && (
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ) : (
              <label className="flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input bg-muted/30 transition hover:bg-muted/50">
                <UploadCloud className="size-7 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Klik untuk upload cover (JPG, PNG, WEBP, maks 5MB)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverChange} />
              </label>
            )}
          </div>

          {/* Cover Description — always visible */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Deskripsi Cover{coverFile ? <span className="text-destructive"> *</span> : ""}
            </label>
            <Textarea
              placeholder="Masukkan deskripsi cover / alt text (min. 20 karakter)..."
              value={coverDescription}
              onChange={(e) => setCoverDescription(e.target.value)}
              rows={3}
            />
            {coverFile && coverDescription.length > 0 && coverDescription.length < 20 && (
              <p className="text-xs text-destructive">{coverDescription.length}/20 karakter minimum</p>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Status</span>
            <Select value={status} onValueChange={(v) => setStatus(v as ArticleStatus)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex flex-row justify-end gap-2 px-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Batal
          </Button>
          <Button
            variant="secondary"
            onClick={() => { setOpen(false); router.push(`/content-website/articles/${article.article_id}/edit`); }}
            disabled={isPending}
          >
            <ExternalLink className="mr-2 size-4" />
            Edit Konten
          </Button>
          <Button onClick={handleSaveMeta} disabled={isPending || title.trim().length < 10}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}