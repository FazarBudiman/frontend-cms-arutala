"use client";

import { QuoteBlockData } from "@/features/article/type";

interface QuoteBlockProps {
  data: QuoteBlockData;
}

/**
 * QuoteBlock - Renders blockquotes with optional caption
 */
export function QuoteBlock({ data }: QuoteBlockProps) {
  const { text, caption, alignment = "left" } = data;

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];

  return (
    <blockquote
      className={`
                my-8 border-l-4 border-[var(--color-accent-500)] 
                bg-[var(--color-accent-50)] p-6 rounded-r-xl
                ${alignmentClass}
            `}
    >
      <p className="text-lg sm:text-xl text-[var(--color-neutral-800)] italic leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
      {caption && <footer className="mt-4 text-sm text-[var(--color-neutral-600)] font-medium">— {caption}</footer>}
    </blockquote>
  );
}
