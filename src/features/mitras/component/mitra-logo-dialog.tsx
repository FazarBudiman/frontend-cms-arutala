"use client";

import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { UpdateMitraInput, Mitra, updateMitraSchema } from "../type";
import { useUpdateMitra } from "../hook";
import { EntityDialog } from "@/components/shared/entity-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function MitraLogoDialog({ mitra }: { mitra: Mitra }) {
  const [open, setOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(mitra.mitra_logo_url);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: updateMitra, isPending } = useUpdateMitra();

  // We only care about mitraLogo in this dialog
  const form = useForm<Pick<UpdateMitraInput, "mitraLogo">>({
    resolver: zodResolver(updateMitraSchema.pick({ mitraLogo: true })),
    defaultValues: {
      mitraLogo: undefined,
    },
  });

  const handleUpdateLogo = async (values: Pick<UpdateMitraInput, "mitraLogo">) => {
    if (!values.mitraLogo) {
      toast.error("Silakan pilih logo terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("mitraLogo", values.mitraLogo);

    toast.promise(
      updateMitra({
        id: mitra.mitra_id,
        data: formData,
      }),
      {
        loading: "Updating logo...",
        success: () => {
          setOpen(false);
          return "Logo mitra berhasil diperbarui";
        },
        error: (err) => err.message || "Failed to update logo",
      },
    );
  };

  useEffect(() => {
    return () => {
      if (previewLogo && previewLogo !== mitra.mitra_logo_url) {
        URL.revokeObjectURL(previewLogo);
      }
    };
  }, [previewLogo, mitra.mitra_logo_url]);

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Update Logo Mitra"
      description="Pilih file logo baru untuk mitra ini"
      isPending={isPending}
      saveLabel="Update Logo"
      onSubmit={form.handleSubmit(handleUpdateLogo)}
      className="sm:max-w-md"
      trigger={
        <div className="w-full max-w-sm cursor-pointer hover:opacity-80 transition-opacity">
          <AspectRatio ratio={4 / 2} className="bg-accent rounded-lg border overflow-hidden">
            <Image src={mitra.mitra_logo_url} alt={mitra.mitra_name} fill className="object-contain p-2" />
          </AspectRatio>
        </div>
      }
    >
      <Controller
        name="mitraLogo"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col items-center gap-4 py-4">
            <Field data-invalid={fieldState.invalid} className="w-full flex flex-col items-center gap-4">
              <FieldLabel htmlFor="mitraLogo" className="sr-only">
                Logo Mitra
              </FieldLabel>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  field.onChange(file);
                  if (previewLogo && previewLogo !== mitra.mitra_logo_url) {
                    URL.revokeObjectURL(previewLogo);
                  }
                  setPreviewLogo(URL.createObjectURL(file));
                }}
              />

              <div className="relative h-48 w-full rounded-md overflow-hidden border bg-muted">
                {previewLogo ? (
                  <Image src={previewLogo} alt="preview-logo" fill unoptimized className="object-contain p-4" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic text-sm">No image selected</div>
                )}
              </div>

              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                {previewLogo ? "Pilih Logo Lain" : "Upload Logo"}
              </Button>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          </div>
        )}
      />
    </EntityDialog>
  );
}
