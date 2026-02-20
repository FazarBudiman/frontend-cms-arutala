// "use client";

// import { useRef, useState } from "react";
// import { toast } from "sonner";
// import { PlusCircle, UploadCloud, X } from "lucide-react";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// import { ArticleEditor, ArticleEditorHandle } from "./article-editor";
// import { useCreateArticle, useUploadArticleCover, useUploadArticleImage } from "../hook";
// import { ContentBlock } from "../type";

// export function ArticleAddSheet() {
//   const [open, setOpen] = useState(false);
//   const [coverPreview, setCoverPreview] = useState<string | null>(null);

//   const editorRef = useRef<ArticleEditorHandle>(null);

//   const { mutateAsync: createArticle, isPending: isCreating } = useCreateArticle();
//   const { mutateAsync: uploadCover, isPending: isUploading } = useUploadArticleCover();
//   const { mutateAsync: uploadImage } = useUploadArticleImage();

//   const [coverUrl, setCoverUrl] = useState<string | null>(null);

//   const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setCoverPreview(URL.createObjectURL(file));

//     const formData = new FormData();
//     formData.append("cover", file);

//     const toastId = toast.loading("Mengupload cover...");
//     try {
//       const result = await uploadCover(formData); // await langsung, tipe aman
//       setCoverUrl(result.cover_url);
//       toast.success("Cover berhasil diupload", { id: toastId });
//     } catch (err: unknown) {
//       setCoverPreview(null);
//       setCoverUrl(null);
//       const message = err instanceof Error ? err.message : "Gagal mengupload cover";
//       toast.error(message, { id: toastId });
//     }
//   };

//   const handleImageUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append("cover", file);
//     try {
//       const result = await uploadImage(formData);
//       return { success: 1, file: { url: result.cover_url } };
//     } catch {
//       return { success: 0, file: { url: "" } };
//     }
//   };

//   const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
//     if (!editorRef.current) return;

//     try {
//       const outputData = await editorRef.current.save();
//       const blocks = outputData.blocks.map((block) => ({
//         id: block.id ?? "",
//         type: block.type,
//         data: block.data,
//       })) as z.infer<typeof ContentBlock>[];

//       await toast.promise(
//         createArticle({
//           article_content_blocks: blocks,
//           status,
//           ...(coverUrl ? { cover_url: coverUrl } : {}),
//         }),
//         {
//           loading: status === "PUBLISHED" ? "Mempublish artikel..." : "Menyimpan draft...",
//           success: status === "PUBLISHED" ? "Artikel berhasil dipublish" : "Draft berhasil disimpan",
//           error: (err) => err.message || "Gagal menyimpan artikel",
//         },
//       );

//       setOpen(false);
//       setCoverPreview(null);
//     } catch {
//       /* handled by toast.promise */
//     }
//   };

//   const handleOpenChange = (val: boolean) => {
//     setOpen(val);
//     if (!val) {
//       setCoverPreview(null);
//       setCoverUrl(null); // Reset URL
//     }
//   };

//   return (
//     <Sheet open={open} onOpenChange={handleOpenChange}>
//       <SheetTrigger asChild>
//         <Button>
//           <PlusCircle className="mr-2 size-4" />
//           Add Article
//         </Button>
//       </SheetTrigger>

//       <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl" showCloseButton>
//         <SheetHeader>
//           <SheetTitle>Tambah Artikel Baru</SheetTitle>
//         </SheetHeader>

//         <div className="flex flex-col gap-6 px-4 py-4">
//           {/* Cover Upload */}
//           <div className="flex flex-col gap-2">
//             <span className="text-sm font-medium">Cover Artikel</span>
//             {coverPreview ? (
//               <div className="relative h-48 w-full">
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img src={coverPreview} alt="cover preview" className="h-full w-full rounded-md object-cover" />
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setCoverPreview(null);
//                     setCoverUrl(null); // Reset URL juga
//                   }}
//                   className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
//                 >
//                   <X className="size-4" />
//                 </button>
//               </div>
//             ) : (
//               <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input bg-muted/30 transition hover:bg-muted/50">
//                 <UploadCloud className="size-8 text-muted-foreground" />
//                 <span className="text-sm text-muted-foreground">{isUploading ? "Mengupload..." : "Klik untuk upload cover"}</span>
//                 <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} disabled={isUploading} />
//               </label>
//             )}
//           </div>

//           {/* Editor */}
//           <div className="flex flex-col gap-2">
//             <span className="text-sm font-medium">Konten Artikel</span>
//             {open && <ArticleEditor ref={editorRef} holder="article-add-editor" onUploadImage={handleImageUpload} />}
//           </div>
//         </div>

//         <SheetFooter className="flex flex-row justify-end gap-2 px-4">
//           <Button variant="outline" onClick={() => setOpen(false)} disabled={isCreating}>
//             Batal
//           </Button>
//           <Button variant="secondary" onClick={() => handleSubmit("DRAFT")} disabled={isCreating || isUploading}>
//             Simpan Draft
//           </Button>
//           <Button onClick={() => handleSubmit("PUBLISHED")} disabled={isCreating || isUploading}>
//             Publish
//           </Button>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// }
