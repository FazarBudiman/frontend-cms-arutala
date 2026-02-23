"use client";

import { CodeBlockData, ContentBlockType } from "@/features/article/type";

interface CodeBlockProps {
  data: CodeBlockData;
}

/**
 * CodeBlock - Renders code snippets with syntax highlighting styling
 */
export function CodeBlock({ data }: CodeBlockProps) {
  const { code, language } = data;

  return (
    <div className="my-6">
      {language && <div className="bg-[var(--color-neutral-800)] text-[var(--color-neutral-300)] text-xs px-4 py-2 rounded-t-lg font-mono">{language}</div>}
      <pre
        className={`
                    bg-[var(--color-neutral-900)] text-[var(--color-neutral-100)] 
                    p-4 overflow-x-auto text-sm sm:text-base font-mono leading-relaxed
                    ${language ? "rounded-b-lg" : "rounded-lg"}
                `}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
