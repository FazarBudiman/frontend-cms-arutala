"use client";

import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Testimoni, UpdateTestimoniInput, updateTestimoniSchema } from "../type";
import { useUpdateTestimoni } from "../hook";
import { EntityDialog } from "@/components/shared/entity-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TestimoniProfileDialog({ testimoni }: { testimoni: Testimoni }) {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(testimoni.author_profile_url);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: updateTestimoni, isPending } = useUpdateTestimoni();

  const form = useForm<Pick<UpdateTestimoniInput, "authorProfile">>({
    resolver: zodResolver(updateTestimoniSchema.pick({ authorProfile: true })),
    defaultValues: {
      authorProfile: undefined,
    },
  });

  const handleUpdateProfile = async (values: Pick<UpdateTestimoniInput, "authorProfile">) => {
    if (!values.authorProfile) {
      toast.error("Silakan pilih foto profil terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("authorProfile", values.authorProfile);

    toast.promise(
      updateTestimoni({
        id: testimoni.testimoni_id,
        data: formData,
      }),
      {
        loading: "Updating profile...",
        success: () => {
          setOpen(false);
          return "Foto profil berhasil diperbarui";
        },
        error: (err) => err.message || "Failed to update profile",
      },
    );
  };

  useEffect(() => {
    return () => {
      if (previewProfile && previewProfile !== testimoni.author_profile_url) {
        URL.revokeObjectURL(previewProfile);
      }
    };
  }, [previewProfile, testimoni.author_profile_url]);

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Update Foto Profil"
      description="Pilih foto profil baru untuk author testimoni ini"
      isPending={isPending}
      saveLabel="Update Profile"
      onSubmit={form.handleSubmit(handleUpdateProfile)}
      className="sm:max-w-[340px]"
      contentClassName="!grid-cols-1"
      trigger={
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar>
            <AvatarImage src={testimoni.author_profile_url} alt="user-profile" />
            <AvatarFallback>{testimoni.author_name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      }
    >
      <Controller
        name="authorProfile"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="pt-4 pb-1">
            <Field data-invalid={fieldState.invalid} className="w-full flex flex-col items-center gap-5">
              <FieldLabel htmlFor="authorProfile" className="sr-only">
                Foto Profil
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
                  if (previewProfile && previewProfile !== testimoni.author_profile_url) {
                    URL.revokeObjectURL(previewProfile);
                  }
                  setPreviewProfile(URL.createObjectURL(file));
                }}
              />

              <div className="relative h-60 w-60 rounded-lg overflow-hidden border bg-muted shrink-0">
                {previewProfile ? (
                  <Image src={previewProfile} alt="preview-profile" fill unoptimized className="object-contain p-2" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic text-sm">No image</div>
                )}
              </div>

              <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                {previewProfile ? "Pilih Foto Lain" : "Upload Foto"}
              </Button>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          </div>
        )}
      />
    </EntityDialog>
  );
}
