"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import type { OutputData } from "@editorjs/editorjs";
import { ArrowLeft, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArticleEditor, ArticleEditorHandle } from "@/features/article/component/article-editor";
import { useArticleDetail, useUpdateArticle } from "@/features/article/hook";
import { ContentBlock } from "@/features/article/type";

export default function ArticleEditPage() {
  const router = useRouter();
  const { articleId } = useParams<{ articleId: string }>();

  const editorRef = useRef<ArticleEditorHandle>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");

  const { data: articleDetail, isLoading } = useArticleDetail(articleId);
  const { mutateAsync: updateArticle } = useUpdateArticle();

  // Populate title once article is loaded
  useEffect(() => {
    if (articleDetail?.article_title) {
      setTitle(articleDetail.article_title);
    }
  }, [articleDetail?.article_title]);

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
  }, [articleDetail]);

  const handleSave = async (status: "DRAFT" | "REVIEW" | "PUBLISHED" | "UNPUBLISHED") => {
    if (title.trim().length < 10) {
      toast.error("Judul minimal 10 karakter");
      return;
    }
    if (!editorRef.current) return;
    setIsSaving(true);
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
          articleId,
          // title is REQUIRED for PATCH (minLength: 10)
          body: { title: title.trim(), contentBlocks: blocks, status },
        }),
        {
          loading: status === "PUBLISHED" ? "Mempublish..." : "Menyimpan draft...",
          success: status === "PUBLISHED" ? "Artikel berhasil dipublish" : "Draft tersimpan",
          error: (err) => err.message || "Gagal menyimpan",
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
          {/* Editable title in toolbar */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul artikel (min. 10 karakter)..."
            className="h-8 w-72 text-sm font-semibold"
            disabled={isLoading}
          />
          {title.length > 0 && title.length < 10 && (
            <span className="text-xs text-destructive">{title.length}/10 min</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("DRAFT")}
            disabled={isSaving || isLoading || title.trim().length < 10}
          >
            <Save className="mr-2 size-4" />
            Simpan Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave("PUBLISHED")}
            disabled={isSaving || isLoading || title.trim().length < 10}
          >
            <Send className="mr-2 size-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <span className="text-muted-foreground">Memuat konten artikel...</span>
          </div>
        ) : (
          <ArticleEditor
            ref={editorRef}
            holder={`article-full-editor-${articleId}`}
            defaultData={defaultEditorData}
          />
        )}
      </div>
    </div>
  );
}
