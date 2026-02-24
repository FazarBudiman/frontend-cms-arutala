"use client";

import { useMemo, useState } from "react";
import type { OutputBlockData, OutputData } from "@editorjs/editorjs";
import { ArticleEditor, ArticlePreview, ContentBlockType, uploadArticleImage, useArticleDetail, useUpdateArticle, ArticleChangeStatusDialog } from "@/features/article";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useSetBreadcrumbLabel } from "@/providers";

function mapEditorBlocks(blocks: OutputBlockData[]): ContentBlockType[] {
  return blocks.map((block, index) => ({
    id: block.id ?? `generated-${index}`,
    type: block.type as ContentBlockType["type"],
    data: block.data,
  }));
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();

  const articleId = params.articleId as string;

  const { data: articleDetail, isPending: isLoadingDetail } = useArticleDetail(articleId);

  useSetBreadcrumbLabel(`/content-website/articles/${articleId}`, articleDetail?.article_title);
  useSetBreadcrumbLabel(`/content-website/articles/${articleId}/edit`, "Edit Article");
  const [data, setData] = useState<OutputData | undefined>();
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const initialData = useMemo(() => {
    if (!articleDetail?.article_content_blocks) return undefined;
    return {
      time: new Date().getTime(),
      blocks: articleDetail.article_content_blocks as OutputBlockData[],
      version: "2.30.7",
    };
  }, [articleDetail]);

  const mappedBlocks = useMemo(() => {
    const blocksToMap = data?.blocks ?? (articleDetail?.article_content_blocks as OutputBlockData[] | undefined);
    if (!blocksToMap) return null;
    return mapEditorBlocks(blocksToMap);
  }, [data, articleDetail]);

  const { mutateAsync: updateArticle, isPending: isUpdating } = useUpdateArticle();

  const handleSave = async () => {
    if (!mappedBlocks) return;

    toast.promise(updateArticle({ articleId, body: { contentBlocks: mappedBlocks } }), {
      loading: "Updating article...",
      success: () => {
        router.push(`/content-website/articles/${articleId}`);
        return "Article updated successfully";
      },
      error: (err) => err.message || "Failed to update article",
    });
  };

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
            <CardTitle>Edit Article</CardTitle>
            <CardAction className="flex gap-2">
              {articleDetail && <ArticleChangeStatusDialog article={articleDetail} />}
              <Button type="submit" size="sm" onClick={handleSave} disabled={isLoadingDetail || isUpdating}>
                {isLoadingDetail || isUpdating ? "Saving..." : "Save Changes"}
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
                {initialData ? (
                  <ArticleEditor key={articleId} defaultData={initialData} onChange={(d) => setData(d)} onUploadImage={handleUploadImage} />
                ) : (
                  <div className="flex h-[400px] items-center justify-center border-2 border-dashed rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="text-muted-foreground font-medium">Loading content editor...</p>
                    </div>
                  </div>
                )}
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
