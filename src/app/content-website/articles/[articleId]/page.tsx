"use client";

import { useMemo } from "react";
import type { OutputBlockData } from "@editorjs/editorjs";
import { ArticlePreview, useArticleDetail, ArticleCoverEditDialog } from "@/features/article";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useSetBreadcrumbLabel } from "@/providers";
import { mapEditorBlocks } from "@/shared/utils/editor";

export default function DetailArticlePage() {
  const router = useRouter();
  const { articleId } = useParams();
  const { data, isLoading } = useArticleDetail(articleId as string);

  useSetBreadcrumbLabel(`/content-website/articles/${articleId}`, data?.article_title);

  const mappedBlocks = useMemo(() => {
    if (!data?.article_content_blocks) return null;
    return mapEditorBlocks(data.article_content_blocks as OutputBlockData[]);
  }, [data]);

  if (isLoading) {
    // TODO: Implement Skeleton
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 border-b bg-muted/20">
        <ButtonGroup className="justify-between w-full h-8">
          <Button variant="outline" size="sm" onClick={() => router.push("/content-website/articles")}>
            Back to List
          </Button>
          <div className="flex gap-2">
            <ArticleCoverEditDialog articleDetail={data!} />
            <Button size="sm" onClick={() => router.push(`/content-website/articles/${articleId}/edit`)}>
              Edit Article
            </Button>
          </div>
        </ButtonGroup>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/10 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Article Header */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{data?.article_title}</h1>
              <p className="text-muted-foreground">{data?.article_cover_description}</p>
            </div>

            {data?.article_cover_url && (
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border bg-muted">
                <Image src={data.article_cover_url} alt={data.article_title || "Article cover"} fill className="object-cover" />
              </AspectRatio>
            )}
          </div>

          <Separator />

          {/* Article Content */}
          <div className="bg-background rounded-lg border p-6 lg:p-8 shadow-sm">
            {mappedBlocks ? <ArticlePreview blocks={mappedBlocks} /> : <div className="text-center py-10 text-muted-foreground">No content blocks available.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
