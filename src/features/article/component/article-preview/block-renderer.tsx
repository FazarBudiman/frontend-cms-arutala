"use client";

import { HeaderBlock, ParagraphBlock, ImageBlock, ListBlock, CodeBlock, QuoteBlock, ChecklistBlock, DelimiterBlock } from "./blocks";
import { ContentBlockType, HeaderBlockData, ParagraphBlockData, ImageBlockData, ListBlockData, CodeBlockData, QuoteBlockData, ChecklistBlockData } from "../../type";

interface BlockRendererProps {
  block: ContentBlockType;
}

/**
 * BlockRenderer - Renders different block types based on Editor.js format
 */
export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "header":
      return <HeaderBlock data={block.data as HeaderBlockData} />;
    case "paragraph":
      return <ParagraphBlock data={block.data as ParagraphBlockData} />;
    case "image":
      return <ImageBlock data={block.data as ImageBlockData} />;
    case "list":
      return <ListBlock data={block.data as ListBlockData} />;
    case "code":
      return <CodeBlock data={block.data as CodeBlockData} />;
    case "quote":
      return <QuoteBlock data={block.data as QuoteBlockData} />;
    case "checklist":
      return <ChecklistBlock data={block.data as ChecklistBlockData} />;
    case "delimiter":
      return <DelimiterBlock />;
    default:
      // Unknown block type - render nothing
      console.warn("Unknown block type:", (block as { type: string }).type);
      return null;
  }
}
