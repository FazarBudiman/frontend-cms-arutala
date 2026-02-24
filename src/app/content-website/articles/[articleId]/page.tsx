"use client";

import { useMemo } from "react";
import type { OutputBlockData } from "@editorjs/editorjs";
import { ArticlePreview, ContentBlockType, useArticleDetail, ArticleCoverEditDialog } from "@/features/article";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useSetBreadcrumbLabel } from "@/providers";

function mapEditorBlocks(blocks: OutputBlockData[]): ContentBlockType[] {
  return blocks.map((block, index) => ({
    id: block.id ?? `generated-${index}`,
    type: block.type as ContentBlockType["type"],
    data: block.data,
  }));
}

export default function DetailArticlePage() {
  const router = useRouter();
  const { articleId } = useParams();
  const { data } = useArticleDetail(articleId as string);

  useSetBreadcrumbLabel(`/content-website/articles/${articleId}`, data?.article_title);

  const mappedBlocks = useMemo(() => {
    if (!data?.article_content_blocks) return null;
    return mapEditorBlocks(data.article_content_blocks as OutputBlockData[]);
  }, [data]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 border-b bg-muted/20">
        <ButtonGroup className="p-4 w-full flex gap-2">
          <Button onClick={() => router.push(`/content-website/articles/${articleId}/edit`)}>Edit Article</Button>
          {data && <ArticleCoverEditDialog articleDetail={data} />}
        </ButtonGroup>
        <div className="mx-auto max-w-6xl">
          {data?.article_cover_url && (
            <div className="mb-4 overflow-hidden rounded-xl border bg-accent shadow-lg">
              <AspectRatio ratio={9 / 3}>
                <Image src={data.article_cover_url} alt={data.article_title || "Article cover"} fill className="object-cover" priority />
              </AspectRatio>
            </div>
          )}
          {data?.article_cover_description && <div className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-6xl">{data.article_cover_description}</div>}
          <Separator className="my-8" />
          <ArticlePreview blocks={mappedBlocks} />
        </div>
      </div>
    </div>
  );
}
