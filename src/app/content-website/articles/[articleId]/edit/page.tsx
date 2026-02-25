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
import { mapEditorBlocks, handleUploadImage } from "@/shared/utils/editor";
import { ContentBlockType } from "@/features/article/type";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { SkeletonDetailCard } from "@/components/shared/skeleton-detail-card";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.articleId as string;

  const { data: articleDetail, isLoading } = useArticleDetail(articleId);
  const { mutateAsync: updateArticle, isPending: isUpdating } = useUpdateArticle();
  const [editorData, setEditorData] = useState<OutputData | undefined>(undefined);

  const initialData = useMemo(() => {
    if (!articleDetail?.article_content_blocks) return undefined;
    return {
      time: new Date().getTime(),
      blocks: articleDetail.article_content_blocks as OutputBlockData[],
      version: "",
    };
  }, [articleDetail]);

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
    return <SkeletonDetailCard />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 border-b bg-muted/20">
        <div className="flex items-center justify-around">
          <ArticleChangeStatusDialog article={articleDetail!} />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/content-website/articles/${articleId}`)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1">
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

          <div className="flex-1 relative">
            <TabsContent value="editor" className="m-0 p-4 lg:p-6  bg-muted/5">
              <Card className="max-w-full mx-auto min-h-125">
                <CardHeader className="border-b bg-muted/10 py-4">
                  <CardTitle className="text-sm font-medium">Article Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ArticleEditor defaultData={initialData} onChange={setEditorData} onUploadImage={handleUploadImage} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className=" m-0 p-4 lg:p-6 bg-muted/5">
              <div className="max-w-full mx-auto space-y-6">
                <Card>
                  <CardHeader className="border-b bg-muted/10 py-4">
                    <CardTitle className="text-sm font-medium">Header Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 p-6">
                      <div className="space-y-2">
                        <h1 className="text-xl font-bold tracking-tight">{articleDetail?.article_title}</h1>
                        <p className="text-muted-foreground text-md">{articleDetail?.article_cover_description}</p>
                      </div>

                      {articleDetail?.article_cover_url && (
                        <AspectRatio ratio={4 / 2} className="overflow-hidden rounded-lg border bg-muted">
                          <Image src={articleDetail.article_cover_url} alt={articleDetail.article_title || "Article cover"} fill className="object-cover" />
                        </AspectRatio>
                      )}
                    </div>
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
