"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArticleEditor, ArticleEditorHandle } from "@/features/article/component/article-editor";
import { useCreateArticle, useUploadArticleImage } from "@/features/article/hook";
import { ContentBlock } from "@/features/article/type";

export default function ArticleNewPage() {
  const router = useRouter();
  const editorRef = useRef<ArticleEditorHandle>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { mutateAsync: createArticle } = useCreateArticle();
  const { mutateAsync: uploadImage } = useUploadArticleImage();

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("cover", file);
    try {
      const result = await uploadImage(formData);
      return { success: 1, file: { url: result.cover_url } };
    } catch {
      return { success: 0, file: { url: "" } };
    }
  };

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!editorRef.current) return;
    setIsSaving(true);
    try {
      const outputData = await editorRef.current.save();
      const blocks = outputData.blocks.map((block) => ({
        id: block.id ?? "",
        type: block.type,
        data: block.data as any,
      })) as z.infer<typeof ContentBlock>[];

      await toast.promise(
        createArticle({ article_content_blocks: blocks, status }),
        {
          loading: status === "PUBLISHED" ? "Mempublish artikel..." : "Menyimpan draft...",
          success: () => {
            router.push("/articles");
            return status === "PUBLISHED" ? "Artikel berhasil dipublish" : "Draft berhasil disimpan";
          },
          error: (err) => err.message || "Gagal menyimpan artikel",
        },
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-6 py-3 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 size-4" />
            Kembali
          </Button>
          <div className="h-5 w-px bg-border" />
          <h1 className="text-sm font-semibold">Artikel Baru</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSave("DRAFT")} disabled={isSaving}>
            <Save className="mr-2 size-4" />
            Simpan Draft
          </Button>
          <Button size="sm" onClick={() => handleSave("PUBLISHED")} disabled={isSaving}>
            <Send className="mr-2 size-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <ArticleEditor
          ref={editorRef}
          holder="article-new-editor"
          onUploadImage={handleImageUpload}
        />
      </div>
    </div>
  );
}