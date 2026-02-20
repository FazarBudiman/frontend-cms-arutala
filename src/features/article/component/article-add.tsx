"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusCircle, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCreateArticle, useUpdateArticle, useUploadArticleCover } from "../hook";

export function ArticleAddSheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverDescription, setCoverDescription] = useState("");

  const { mutateAsync: createArticle, isPending: isCreating } = useCreateArticle();
  const { mutateAsync: updateArticle, isPending: isUpdating } = useUpdateArticle();
  const { mutateAsync: uploadCover, isPending: isUploading } = useUploadArticleCover();

  const isPending = isCreating || isUpdating || isUploading;

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

  const handleContinueToEditor = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    try {
      // 1. POST /article/ — backend only accepts contentBlocks (minItems: 1)
      // Pass title so the initial header block text matches the article title
      const article = await createArticle(title.trim());
      const articleId = article.article_id;

      // 2. PATCH /article/{id} — title required (minLength: 10)
      await updateArticle({ articleId, body: { title: title.trim() } });

      // 3. POST /article/{id}/cover — only if user selected a file
      if (coverFile) {
        const formData = new FormData();
        formData.append("cover_image", coverFile);
        formData.append("cover_description", coverDescription.trim());
        await uploadCover({ articleId, formData });
      }

      toast.success("Artikel dibuat, membuka editor...");
      setOpen(false);
      router.push(`/content-website/articles/${articleId}/edit`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal membuat artikel";
      toast.error(message);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setTitle("");
      setCoverFile(null);
      setCoverPreview(null);
      setCoverDescription("");
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 size-4" />
          Add Article
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg" showCloseButton>
        <SheetHeader>
          <SheetTitle>Tambah Artikel Baru</SheetTitle>
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

          {/* Cover Image */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Cover Artikel (opsional)</span>
            {coverPreview ? (
              <div className="relative h-48 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverPreview} alt="cover preview" className="h-full w-full rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input bg-muted/30 transition hover:bg-muted/50">
                <UploadCloud className="size-7 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Klik untuk upload cover (JPG, PNG, WEBP, maks 5MB)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverChange} />
              </label>
            )}
          </div>

          {/* Cover Description — only shown when cover selected */}
          {coverFile && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Deskripsi Cover <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Masukkan deskripsi cover / alt text (min. 20 karakter)..."
                value={coverDescription}
                onChange={(e) => setCoverDescription(e.target.value)}
                rows={3}
              />
              {coverDescription.length > 0 && coverDescription.length < 20 && (
                <p className="text-xs text-destructive">{coverDescription.length}/20 karakter minimum</p>
              )}
            </div>
          )}
        </div>

        <SheetFooter className="flex flex-row justify-end gap-2 px-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Batal
          </Button>
          <Button onClick={handleContinueToEditor} disabled={isPending || !title.trim()}>
            {isPending ? "Memproses..." : "Lanjut ke Editor →"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}