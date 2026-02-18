import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUploadCourseBatch } from "../../hook";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export function CourseBatchUpload() {
    const [previewProfile, setPreviewProfile] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { mutateAsync, isPending } = useUploadCourseBatch();
    const params = useParams();
    const courseId = params.courseId as string;
    const courseBatchId = params.courseBatchId as string;
    const handleUpload = () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("poster", selectedFile);
        toast.promise(mutateAsync({ courseId, batchId: courseBatchId, formData }), {
            loading: "Uploading...",
            success: "Uploaded successfully",
            error: "Failed to upload",
        });
    }
    return (
        <Field orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start mb-2 w-fit">
            {/* <FieldLabel className="text-sm" htmlFor="poster">Poster</FieldLabel> */}
            <p className="text-muted-foreground text-sm">Poster</p>
            <Input
                id="poster"
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSelectedFile(file);
                    setPreviewProfile(URL.createObjectURL(file));
                }}
            />
            {/* {fieldState.invalid && <FieldError errors={[fieldState.error]} />} */}
            {previewProfile && (
                <div className="flex flex-col gap-4 items-center">
                    <Image src={previewProfile} alt="Poster" width={600} height={350} className="w-full max-h-72 object-contain" />
                    <Button size="sm" className="w-fit" type="submit" onClick={handleUpload} disabled={isPending}>{isPending ? "Uploading..." : "Upload"}</Button>
                </div>
            )}


        </Field>
    );
}