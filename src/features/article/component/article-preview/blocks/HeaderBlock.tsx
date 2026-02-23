"use client";

import { HeaderBlockData } from "@/features/article/type";

interface HeaderBlockProps {
  data: HeaderBlockData;
}

/**
 * HeaderBlock - Renders heading elements with anchor id for TOC navigation
 */
export function HeaderBlock({ data }: HeaderBlockProps) {
  const { text, level } = data;

  // Generate id from text for anchor links
  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

  const baseClass = "scroll-mt-24";

  switch (level) {
    case 1:
      return (
        <h1 id={id} className={`text-3xl sm:text-4xl font-bold mb-6 mt-10 text-[var(--color-neutral-950)] ${baseClass}`}>
          {text}
        </h1>
      );
    case 2:
      return (
        <h2 id={id} className={`text-2xl sm:text-3xl font-bold mb-5 mt-8 text-[var(--color-neutral-950)] ${baseClass}`}>
          {text}
        </h2>
      );
    case 3:
      return (
        <h3 id={id} className={`text-xl sm:text-2xl font-semibold mb-4 mt-6 text-[var(--color-neutral-950)] ${baseClass}`}>
          {text}
        </h3>
      );
    case 4:
      return (
        <h4 id={id} className={`text-lg sm:text-xl font-semibold mb-3 mt-5 text-[var(--color-neutral-950)] ${baseClass}`}>
          {text}
        </h4>
      );
    case 5:
      return (
        <h5 id={id} className={`text-base sm:text-lg font-medium mb-2 mt-4 text-[var(--color-neutral-900)] ${baseClass}`}>
          {text}
        </h5>
      );
    case 6:
      return (
        <h6 id={id} className={`text-sm sm:text-base font-medium mb-2 mt-3 text-[var(--color-neutral-800)] ${baseClass}`}>
          {text}
        </h6>
      );
    default:
      return (
        <h3 id={id} className={`text-xl sm:text-2xl font-semibold mb-4 mt-6 text-[var(--color-neutral-950)] ${baseClass}`}>
          {text}
        </h3>
      );
  }
}
