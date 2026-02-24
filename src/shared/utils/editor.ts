"use client";

import type { OutputBlockData } from "@editorjs/editorjs";
import { ContentBlockType, uploadArticleImage as uploadApi } from "@/features/article";

/**
 * Maps EditorJS output blocks to the internal ContentBlockType.
 *
 * @param blocks - The EditorJS OutputBlockData array.
 * @returns An array of ContentBlockType.
 */
export function mapEditorBlocks(blocks: OutputBlockData[]): ContentBlockType[] {
  return blocks.map((block, index) => ({
    id: block.id ?? `generated-${index}`,
    type: block.type as ContentBlockType["type"],
    data: block.data,
  }));
}

/**
 * Handles image upload from EditorJS.
 *
 * @param file - The file to upload.
 * @returns A promise that resolves to the upload result.
 */
export const handleUploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("contentImage", file);

  try {
    const result = await uploadApi(formData);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
