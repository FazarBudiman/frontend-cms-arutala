/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from "react";

import type EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";

export interface ArticleEditorHandle {
  save: () => Promise<OutputData | undefined>;
}

interface ArticleEditorProps {
  readOnly?: boolean;
  defaultData?: OutputData;
  onUploadImage?: (file: File) => Promise<string>;
  onChange?: (data: OutputData) => void;
}

const ArticleEditor = forwardRef<ArticleEditorHandle, ArticleEditorProps>(function ArticleEditorInner({ readOnly = false, defaultData, onUploadImage, onChange }, ref) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializing = useRef(false);

  // Store props in refs to avoid useEffect dependency issues while preventing re-init
  const propsRef = useRef({ onUploadImage, onChange, defaultData });
  useEffect(() => {
    propsRef.current = { onUploadImage, onChange, defaultData };
  }, [onUploadImage, onChange, defaultData]);

  // expose save() to parent if needed
  useImperativeHandle(ref, () => ({
    async save() {
      return await editorRef.current?.save();
    },
  }));

  useEffect(() => {
    if (!holderRef.current) return;
    if (editorRef.current) return;

    let isDestroyed = false;

    const initEditor = async () => {
      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        const List = (await import("@editorjs/list")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Code = (await import("@editorjs/code")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;
        const Underline = (await import("@editorjs/underline")).default;

        if (isDestroyed) return;

        const editor = new EditorJS({
          holder: holderRef.current!,
          readOnly,
          data: propsRef.current.defaultData,

          async onChange() {
            if (!propsRef.current.onChange) return;

            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(async () => {
              const data = await editor.save();
              propsRef.current.onChange?.(data);
            }, 400);
          },

          tools: {
            header: {
              class: Header as unknown as any,
              inlineToolbar: true,
              config: {
                levels: [1, 2, 3, 4],
                defaultLevel: 2,
                placeholder: "Masukkan Judul Artikel...",
              },
            },
            paragraph: {
              class: Paragraph as unknown as any,
              inlineToolbar: true,
              config: {
                placeholder: "Mulai menulis artikel Anda di sini...",
              },
            },
            image: {
              class: ImageTool as unknown as any,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    if (!propsRef.current.onUploadImage) {
                      throw new Error("Upload handler not provided");
                    }

                    const url = await propsRef.current.onUploadImage(file);

                    return {
                      success: 1,
                      file: { url },
                    };
                  },
                },
              },
            },
            list: {
              class: List as unknown as any,
              inlineToolbar: true,
            },
            quote: {
              class: Quote as unknown as any,
              inlineToolbar: true,
            },
            code: Code as unknown as any,
            delimiter: Delimiter as unknown as any,
            inlineCode: InlineCode as unknown as any,
            underline: Underline as unknown as any,
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("Failed to initialize EditorJS:", error);
      }
    };

    initEditor();

    return () => {
      isDestroyed = true;
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [readOnly]); // Add readOnly if it changes, keep others out of deps if they shouldn't trigger re-init

  return (
    <div className="prose max-w-none dark:prose-invert">
      <div ref={holderRef} />
    </div>
  );
});

const ArticleEditorMemo = memo(ArticleEditor);
ArticleEditorMemo.displayName = "ArticleEditor";
export default ArticleEditorMemo;
