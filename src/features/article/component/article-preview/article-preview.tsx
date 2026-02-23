import { ContentBlockType } from "../../type";
import { BlockRenderer } from "./block-renderer";
import { TableOfContents } from "./table-of-content";

interface ArticlePreviewProps {
  blocks: ContentBlockType[] | null;
}

export function ArticlePreview({ blocks }: ArticlePreviewProps) {
  return (
    <section className="w-full bg-white pb-10 sm:pb-12 lg:pb-16">
      <div className="mx-auto max-w-full sm:max-w-md md:max-w-xl lg:max-w-6xl 2xl:max-w-7xl px-6 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          <article className="order-2 lg:order-1">{blocks && blocks.length > 0 ? blocks.map((block) => <BlockRenderer key={block.id} block={block} />) : <p className="text-gray-400">Belum ada konten</p>}</article>

          <aside className="order-1 lg:order-2">
            <TableOfContents blocks={blocks ?? []} />
          </aside>
        </div>
      </div>
    </section>
  );
}
