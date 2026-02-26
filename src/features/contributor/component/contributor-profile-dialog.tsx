"use client";

import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Contributor, UpdateContributorInput, updateContributorSchema } from "../type";
import { useUpdateContributor } from "../hook";
import { EntityDialog } from "@/components/shared/entity-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ContributorProfileDialog({ contributor }: { contributor: Contributor }) {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(contributor.contributor_profile_url);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: updateContributor, isPending } = useUpdateContributor();

  // We only care about profile in this dialog
  const form = useForm<Pick<UpdateContributorInput, "profile">>({
    resolver: zodResolver(updateContributorSchema.pick({ profile: true })),
    defaultValues: {
      profile: undefined,
    },
  });

  const handleUpdateProfile = async (values: Pick<UpdateContributorInput, "profile">) => {
    if (!values.profile) {
      toast.error("Silakan pilih foto profil terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("profile", values.profile);

    toast.promise(
      updateContributor({
        id: contributor.contributor_id,
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
      if (previewProfile && previewProfile !== contributor.contributor_profile_url) {
        URL.revokeObjectURL(previewProfile);
      }
    };
  }, [previewProfile, contributor.contributor_profile_url]);

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Update Foto Profil"
      description="Pilih foto profil baru untuk contributor ini"
      isPending={isPending}
      saveLabel="Update Profile"
      onSubmit={form.handleSubmit(handleUpdateProfile)}
      className="sm:max-w-[340px]"
      contentClassName="!grid-cols-1"
      trigger={
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar>
            <AvatarImage src={contributor.contributor_profile_url} alt="user-profile" />
            <AvatarFallback>{contributor.contributor_name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      }
    >
      <Controller
        name="profile"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="pt-4 pb-1">
            <Field data-invalid={fieldState.invalid} className="w-full flex flex-col items-center gap-5">
              <FieldLabel htmlFor="profile" className="sr-only">
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
                  if (previewProfile && previewProfile !== contributor.contributor_profile_url) {
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
