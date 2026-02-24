"use client";

import { useRef, useState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Image from "next/image";
import { IconListDetails } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { UpdateMitraInput, Mitra, updateMitraSchema } from "../type";
import { useUpdateMitra } from "../hook";
import { EntityDialog } from "@/components/shared/entity-dialog";

export function MitraDetailDialog({ mitra }: { mitra: Mitra }) {
  const [open, setOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(mitra.mitra_logo_url);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: updateMitra, isPending } = useUpdateMitra();

  const form = useForm<UpdateMitraInput>({
    resolver: zodResolver(updateMitraSchema),
    defaultValues: {
      mitraName: "",
      businessField: [],
      mitraLogo: undefined,
    },
  });

  const {
    fields: businessFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "businessField",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        mitraName: mitra.mitra_name,
        businessField: mitra.business_field.map((e) => ({ value: e })),
        mitraLogo: undefined,
      });
      // setPreviewLogo(mitra.mitra_logo_url);
    }
  }, [open, mitra, form]);

  const handleUpdate = async (values: UpdateMitraInput) => {
    const formData = new FormData();
    formData.append("mitraName", values.mitraName);

    values.businessField.forEach((item) => {
      formData.append("businessField", item.value);
    });

    if (values.mitraLogo) {
      formData.append("mitraLogo", values.mitraLogo);
    }

    toast.promise(
      updateMitra({
        id: mitra.mitra_id,
        data: formData,
      }),
      {
        loading: "Updating mitra...",
        success: () => {
          setOpen(false);
          return "Mitra berhasil diperbarui";
        },
        error: (err) => err.message || "Failed to update mitra",
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
      title="Mitra Detail"
      description="Perbarui detail mitra di bawah ini"
      isPending={isPending}
      saveLabel="Update"
      onSubmit={form.handleSubmit(handleUpdate)}
      className="sm:max-w-3xl"
      trigger={
        <Button variant="outline" size="icon-sm">
          <IconListDetails className="h-4 w-4" />
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">
        <Controller
          name="mitraLogo"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="md:col-span-2">
              <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start">
                <FieldLabel htmlFor="mitraLogo">Logo Mitra</FieldLabel>
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
                <div className="flex flex-row items-center gap-4">
                  {previewLogo ? (
                    <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                      <Image src={previewLogo} alt="mitra-logo" fill unoptimized className="object-contain" />
                    </div>
                  ) : null}
                  <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    {previewLogo ? "Ganti Logo" : "Upload Logo"}
                  </Button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            </div>
          )}
        />

        <Controller
          name="mitraName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mitraName">Name</FieldLabel>
              <Input {...field} id="mitraName" aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="businessField"
          control={form.control}
          render={({ fieldState }) => (
            <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Business Field</FieldLabel>
              <Input
                placeholder="Ketik business field lalu Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (!value) return;
                    append({ value });
                    e.currentTarget.value = "";
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {businessFields.map((item, index) => (
                  <Badge key={item.id} variant="outline" className="flex items-center gap-1.5">
                    {item.value}
                    <button type="button" onClick={() => remove(index)} className="rounded-full hover:bg-muted p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </EntityDialog>
  );
}
