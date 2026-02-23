"use client";

import { ImageBlockData } from "@/features/article/type";

interface ImageBlockProps {
  data: ImageBlockData;
}

/**
 * ImageBlock - Renders images with optional caption
 */
export function ImageBlock({ data }: ImageBlockProps) {
  const { file, caption, withBorder, withBackground } = data;

  return (
    <figure className="my-8">
      <div
        className={`
                    relative w-full overflow-hidden rounded-xl
                    ${withBorder ? "border-2 border-gray-200" : ""}
                    ${withBackground ? "bg-gray-100 p-4" : ""}
                `}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.url} alt={caption || "Article image"} className="w-full h-auto object-cover rounded-2xl shadow-2xl" loading="lazy" />
      </div>
      {caption && <figcaption className="text-sm text-[var(--color-neutral-500)] mt-3 text-center italic">{caption}</figcaption>}
    </figure>
  );
}
