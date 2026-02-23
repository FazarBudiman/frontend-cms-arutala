"use client";

import { ParagraphBlockData } from "@/features/article/type";

interface ParagraphBlockProps {
  data: ParagraphBlockData;
}

/**
 * ParagraphBlock - Renders paragraph text with HTML support
 * Note: Using dangerouslySetInnerHTML for Editor.js formatted text
 */
export function ParagraphBlock({ data }: ParagraphBlockProps) {
  const { text } = data;

  return <p className="text-base sm:text-lg text-[var(--color-neutral-700)] leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: text }} />;
}
