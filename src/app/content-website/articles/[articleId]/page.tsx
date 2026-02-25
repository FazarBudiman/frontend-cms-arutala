"use client";

import { useMemo } from "react";
import type { OutputBlockData } from "@editorjs/editorjs";
import { ArticlePreview, useArticleDetail, ArticleCoverEditDialog } from "@/features/article";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useSetBreadcrumbLabel } from "@/providers";
import { mapEditorBlocks } from "@/shared/utils/editor";
import { SkeletonDetailCard } from "@/components/shared/skeleton-detail-card";
import { IconCircleArrowLeft, IconFilePencil } from "@tabler/icons-react";

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
    return <SkeletonDetailCard />;
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <div className="p-4 lg:px-6 border-b bg-muted/20">
        <div className="flex gap-2 justify-between">
          <Button variant="outline" size="icon-sm" onClick={() => router.push("/content-website/articles")}>
            <IconCircleArrowLeft className="size-5" />
          </Button>
          <ButtonGroup>
            <ArticleCoverEditDialog articleDetail={data!} />
            <ButtonGroupSeparator />
            <Button size="sm" onClick={() => router.push(`/content-website/articles/${articleId}/edit`)}>
              Edit Article
              <IconFilePencil />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="flex-1  p-4 lg:p-6 bg-muted/10 ">
        <div className="max-w-full mx-auto space-y-6">
          {/* Article Header */}
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight">{data?.article_title}</h1>
              <p className="text-muted-foreground text-md">{data?.article_cover_description}</p>
            </div>

            {data?.article_cover_url && (
              <AspectRatio ratio={4 / 2} className="overflow-hidden rounded-lg border bg-muted">
                <Image src={data.article_cover_url} alt={data.article_title || "Article cover"} fill className="object-cover" />
              </AspectRatio>
            )}
          </div>

          <Separator />

          {/* Article Content */}
          <div className="bg-background rounded-lg border p-2 lg:p-8 shadow-sm">
            {mappedBlocks ? <ArticlePreview blocks={mappedBlocks} /> : <div className="text-center py-10 text-muted-foreground">No content blocks available.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
