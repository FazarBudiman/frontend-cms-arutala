"use client";

import { useRef, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import type { OutputData } from "@editorjs/editorjs";
import { ArrowLeft, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArticleEditor, ArticleEditorHandle } from "@/features/article/component/article-editor";
import { useArticleDetail, useUpdateArticle } from "@/features/article/hook";
import { ContentBlock } from "@/features/article/type";

export default function ArticleEditPage() {
  const router = useRouter();
  const { articleId } = useParams<{ articleId: string }>();

  const editorRef = useRef<ArticleEditorHandle>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: articleDetail, isLoading } = useArticleDetail(articleId);
  const { mutateAsync: updateArticle } = useUpdateArticle();

  const defaultEditorData: OutputData | undefined = useMemo(() => {
    if (!articleDetail) return undefined;
    return {
      time: 0,
      blocks: articleDetail.article_content_blocks.map((b) => ({
        id: b.id,
        type: b.type,
        data: b.data as any,
      })),
    };
  }, [articleDetail?.article_id]);

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
        updateArticle({
          articleId,
          body: { contentBlocks: blocks, status },
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
          <h1 className="text-sm font-semibold text-foreground">
            {isLoading ? "Memuat..." : articleDetail?.article_title ?? "Edit Artikel"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("DRAFT")}
            disabled={isSaving || isLoading}
          >
            <Save className="mr-2 size-4" />
            Simpan Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave("PUBLISHED")}
            disabled={isSaving || isLoading}
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