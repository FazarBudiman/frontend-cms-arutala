"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";

export type ArticleEditorHandle = {
  save: () => Promise<OutputData>;
};

type ArticleEditorProps = {
  holder: string;
  defaultData?: OutputData;
  readOnly?: boolean;
  onUploadImage?: (file: File) => Promise<{ success: number; file: { url: string } }>;
};

const ArticleEditor = forwardRef<ArticleEditorHandle, ArticleEditorProps>(
  ({ holder, defaultData, readOnly = false, onUploadImage }, ref) => {
    const editorRef = useRef<EditorJS | null>(null);
    const isInitialized = useRef(false);

    useImperativeHandle(ref, () => ({
      save: async () => {
        if (!editorRef.current) throw new Error("Editor not initialized");
        return editorRef.current.save();
      },
    }));

    useEffect(() => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      const initEditor = async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const List = (await import("@editorjs/list")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Code = (await import("@editorjs/code")).default;

        const editor = new EditorJS({
          holder,
          readOnly,
          data: defaultData,
          tools: {
            header: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              class: Header as any,
              config: { levels: [1, 2, 3, 4], defaultLevel: 2 },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            paragraph: { class: Paragraph as any, inlineToolbar: true },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            list: { class: List as any, inlineToolbar: true },
            image: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              class: ImageTool as any,
              config: {
                uploader: {
                  uploadByFile: onUploadImage,
                },
              },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            quote: { class: Quote as any, inlineToolbar: true },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code: { class: Code as any },
          },
          placeholder: "Mulai tulis artikel di sini...",
        });

        editorRef.current = editor;
      };

      initEditor();

      return () => {
        if (editorRef.current && typeof editorRef.current.destroy === "function") {
          editorRef.current.destroy();
          editorRef.current = null;
          isInitialized.current = false;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [holder]);

    return (
      <div
        id={holder}
        className="min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    );
  },
);

ArticleEditor.displayName = "ArticleEditor";

export { ArticleEditor };
