"use client";

import { useMemo, useState } from "react";
import type { OutputBlockData, OutputData } from "@editorjs/editorjs";
import ArticleEditor from "@/features/article/component/article-editor";
import { ArticlePreview } from "@/features/article/component/article-preview/article-preview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {  ContentBlockType } from "@/features/article/type";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import { uploadArticleImage } from "@/features/article/api";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateArticle } from "@/features/article/hook";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function mapEditorBlocks(blocks: OutputBlockData[]): ContentBlockType[] {
  return blocks.map((block, index) => ({
    id: block.id ?? `generated-${index}`,
    type: block.type as ContentBlockType["type"],
    data: block.data,
  }));
}

export default function CreateArticlePage() {
  const router = useRouter();
  const [data, setData] = useState<OutputData | undefined>();
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const {mutateAsync, isPending} = useCreateArticle()

  const mappedBlocks = useMemo(() => {
    if (!data?.blocks) return null;
    return mapEditorBlocks(data.blocks);
  }, [data]);

  const handleCreate = async () => {
    toast.promise(mutateAsync({contentBlocks: mappedBlocks?? []}), {
    loading: "Membuat article ...",
    success: () => {
      router.push("/content-website/articles");
      return "Membuat article berhasil";
    },
    error: (err) => err.message || "Gagal membuat article",
  });
  }

  

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("contentImage", file);

    try {
      const result = await uploadArticleImage(formData);
      console.log(result);
      return result;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      
      <div className="p-4 lg:px-6 border">
        <Card>
          <CardHeader>
            <CardTitle>Create Article</CardTitle>
            <CardAction>
              <Button type="submit" size="sm" onClick={handleCreate} disabled={isPending}>
              {isPending ? "Creating..." : "Create Article"}
            </Button>
            </CardAction>
            
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="edit" className="space-y-6" value={mode} onValueChange={(v) => setMode(v as "edit" | "preview")}>
          <TabsList>
            <TabsTrigger value="edit">
              <CodeIcon /> Editor
            </TabsTrigger>
            <TabsTrigger value="preview">
              <AppWindowIcon />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" forceMount style={{ display: mode === "edit" ? "block" : "none" }}>
            <ArticleEditor defaultData={data} onChange={(d) => setData(d)} onUploadImage={handleUploadImage} />
          </TabsContent>

          <TabsContent value="preview" className="flex flex-col w-full items-center">
            <ArticlePreview blocks={mappedBlocks} />
          </TabsContent>
        </Tabs>
          </CardContent>
        </Card>
          
      </div>
    </div>
  );
}
