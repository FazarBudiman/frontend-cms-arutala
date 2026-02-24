"use client";

import { useMemo, useState } from "react";
import type { OutputBlockData, OutputData } from "@editorjs/editorjs";
import { ArticleEditor, ArticlePreview, useArticleDetail, useUpdateArticle, ArticleChangeStatusDialog } from "@/features/article";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useSetBreadcrumbLabel } from "@/providers";
import { mapEditorBlocks, handleUploadImage } from "@/shared/utils/editor";
import { ContentBlockType } from "@/features/article/type";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.articleId as string;

  const { data: articleDetail, isLoading } = useArticleDetail(articleId);
  const { mutateAsync: updateArticle, isPending: isUpdating } = useUpdateArticle();

  const [editorData, setEditorData] = useState<OutputData | undefined>(undefined);

  useSetBreadcrumbLabel(`/content-website/articles/${articleId}/edit`, articleDetail?.article_title ? `Edit ${articleDetail.article_title}` : undefined);

  const mappedBlocks = useMemo(() => {
    if (editorData?.blocks) {
      return mapEditorBlocks(editorData.blocks);
    }
    if (articleDetail?.article_content_blocks) {
      return mapEditorBlocks(articleDetail.article_content_blocks as OutputBlockData[]);
    }
    return null;
  }, [editorData, articleDetail]);

  const handleSave = async () => {
    if (!editorData) return;

    toast.promise(updateArticle({ articleId, body: { contentBlocks: editorData.blocks as ContentBlockType[] } }), {
      loading: "Updating article...",
      success: () => {
        router.push(`/content-website/articles/${articleId}`);
        return "Article updated successfully";
      },
      error: (err) => err.message || "Failed to update article",
    });
  };

  if (isLoading) {
    // TODO: Implement Skeleton
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 border-b bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/content-website/articles/${articleId}`)}>
              Cancel
            </Button>
            <ArticleChangeStatusDialog article={articleDetail!} />
          </div>
          <Button size="sm" onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full flex flex-col">
          <div className="px-4 border-b bg-background shrink-0">
            <TabsList className="h-12 bg-transparent p-0 gap-6">
              <TabsTrigger
                value="editor"
                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
              >
                <CodeIcon className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
              >
                <AppWindowIcon className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="editor" className="h-full m-0 p-4 lg:p-6 overflow-y-auto no-scrollbar bg-muted/5">
              <Card className="max-w-4xl mx-auto min-h-[500px]">
                <CardHeader className="border-b bg-muted/10 py-4">
                  <CardTitle className="text-sm font-medium">Article Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ArticleEditor defaultData={articleDetail?.article_content_blocks as unknown as OutputData} onChange={setEditorData} onUploadImage={handleUploadImage} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="h-full m-0 p-4 lg:p-6 overflow-y-auto no-scrollbar bg-muted/5">
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader className="border-b bg-muted/10 py-4">
                    <CardTitle className="text-sm font-medium">Header Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{articleDetail?.article_title}</h1>
                    <p className="text-muted-foreground">{articleDetail?.article_cover_description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b bg-muted/10 py-4">
                    <CardTitle className="text-sm font-medium">Content Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 lg:p-8">
                    {mappedBlocks ? <ArticlePreview blocks={mappedBlocks} /> : <div className="text-center py-10 text-muted-foreground">Start writing to see preview.</div>}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
