"use client";

import { Field } from "@/components/ui/field";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useUploadCourseBatch } from "../hook";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function CourseBatchUpload({ posterUrl }: { posterUrl: string | undefined }) {
  const [previewProfile, setPreviewProfile] = useState<string | null>(posterUrl ?? null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { mutateAsync } = useUploadCourseBatch();
  const params = useParams();
  const courseId = params.courseId as string;
  const courseBatchId = params.courseBatchId as string;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);

    const formData = new FormData();
    formData.append("poster", selectedFile);

    toast.promise(mutateAsync({ courseId, batchId: courseBatchId, formData }), {
      loading: "Uploading poster...",
      success: () => {
        setPreviewProfile(objectUrl);
        return "Poster berhasil diperbarui";
      },
      error: "Gagal mengupload poster",
    });

    setSelectedFile(null);
    setOpenConfirm(false);
  };

  return (
    <>
      <Field orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setSelectedFile(file);
            setOpenConfirm(true);

            e.target.value = "";
          }}
        />

        {previewProfile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center max-h-64 max-w-64 h-64 w-64 rounded-md overflow-hidden border">
              <Image src={previewProfile} alt="Poster" width={550} height={350} className="w-full h-full object-contain" />
            </div>

            <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Ganti Poster
            </Button>
          </div>
        ) : (
          <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
            Upload Poster
          </Button>
        )}
      </Field>

      {/* AlertDialog Confirm */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ganti Poster?</AlertDialogTitle>
            <AlertDialogDescription>Poster lama akan diganti dengan file yang baru dipilih. Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpload}>Ya, Ganti Poster</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
