"use client";

import { useMemo, useState } from "react";
import type { OutputData } from "@editorjs/editorjs";
import { ArticleEditor, ArticlePreview, useCreateArticle } from "@/features/article";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { mapEditorBlocks, handleUploadImage } from "@/shared/utils/editor";
import { ContentBlockType } from "@/features/article/type";

export default function CreateArticlePage() {
  const router = useRouter();
  const [data, setData] = useState<OutputData | undefined>();
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const { mutateAsync: createArticle, isPending } = useCreateArticle();

  const mappedBlocks = useMemo(() => {
    if (!data?.blocks) return null;
    return mapEditorBlocks(data.blocks);
  }, [data]);

  const handleCreate = async () => {
    if (!mappedBlocks) return;

    toast.promise(createArticle({ contentBlocks: mappedBlocks as ContentBlockType[] }), {
      loading: "Creating article...",
      success: () => {
        router.push("/content-website/articles");
        return "Article created successfully";
      },
      error: (err) => err.message || "Failed to create article",
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 border-b bg-muted/20">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/content-website/articles")}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={isPending || !mappedBlocks}>
            {isPending ? "Creating..." : "Create Article"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "edit" | "preview")} className="h-full flex flex-col">
          <div className="px-4 border-b bg-background shrink-0">
            <TabsList className="h-12 bg-transparent p-0 gap-6">
              <TabsTrigger
                value="edit"
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
            <TabsContent value="edit" className="h-full m-0 p-4 lg:p-6 overflow-y-auto no-scrollbar bg-muted/5">
              <Card className="max-w-4xl mx-auto min-h-[500px]">
                <CardHeader className="border-b bg-muted/10 py-4">
                  <CardTitle className="text-sm font-medium">Article Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ArticleEditor onChange={setData} onUploadImage={handleUploadImage} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="h-full m-0 p-4 lg:p-6 overflow-y-auto no-scrollbar bg-muted/5">
              <div className="max-w-4xl mx-auto">
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
