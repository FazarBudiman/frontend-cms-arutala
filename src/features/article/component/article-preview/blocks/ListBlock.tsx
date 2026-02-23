/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ListBlockData, ListItem } from "@/features/article/type";

interface ListBlockProps {
  data: ListBlockData;
}

/**
 * ListBlock - Renders ordered or unordered lists
 */
export function ListBlock({ data }: ListBlockProps) {
  const { style, items } = data;

  const Tag = style === "ordered" ? "ol" : "ul";
  const listStyle = style === "ordered" ? "list-decimal" : "list-disc";

  const renderItem = (item: string | ListItem | any, index: number) => {
    if (typeof item === "string") {
      return <li key={index} className="text-base sm:text-lg text-[var(--color-neutral-700)] leading-relaxed pl-1" dangerouslySetInnerHTML={{ __html: item }} />;
    }

    // Handle object structure from EditorJS 2.0+ (content) or custom structures (text)
    const content = item.content || item.text || "";
    
    if (typeof content !== "string") {
      console.warn("ListItem content is not a string:", item);
    }

    return (
      <li key={index} className="text-base sm:text-lg text-[var(--color-neutral-700)] leading-relaxed pl-1">
        <span dangerouslySetInnerHTML={{ __html: String(content) }} />
        {item.items && Array.isArray(item.items) && item.items.length > 0 && (
          <Tag className={`${listStyle} mt-2 ml-6 space-y-2`}>
            {item.items.map((subItem: any, subIndex: number) => renderItem(subItem, subIndex))}
          </Tag>
        )}
      </li>
    );
  };

  return (
    <Tag className={`${listStyle} ml-6 mb-6 space-y-2`}>
      {items.map((item, index) => renderItem(item, index))}
    </Tag>
  );
}
