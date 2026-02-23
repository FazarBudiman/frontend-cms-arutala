/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChecklistBlockData } from "@/features/article/type";
import { CheckIcon } from "lucide-react";

interface ChecklistBlockProps {
  data: ChecklistBlockData;
}

/**
 * ChecklistBlock - Renders a checklist with items
 */
export function ChecklistBlock({ data }: ChecklistBlockProps) {
  const { items } = data;

  return (
    <div className="space-y-3 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center ${item.checked ? "bg-primary border-primary" : "border-gray-300"}`}>
            {item.checked && <CheckIcon className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className={`text-base sm:text-lg leading-relaxed ${item.checked ? "text-gray-500 line-through" : "text-[var(--color-neutral-700)]"}`} dangerouslySetInnerHTML={{ __html: item.text || (item as any).content || "" }} />
        </div>
      ))}
    </div>
  );
}
