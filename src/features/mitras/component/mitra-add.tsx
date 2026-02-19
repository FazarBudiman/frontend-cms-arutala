import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, X } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useCreateMitra } from "../hook";
import { CreateMitraInput, createMitraSchema } from "../type";
import { Separator } from "@/components/ui/separator";

export function MitraAddDialog() {
  const [open, setOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useCreateMitra();

  const handleCreate = async (values: CreateMitraInput) => {
    const formData = new FormData();
    formData.append("mitraName", values.mitraName);

    for (const item of values.businessField) {
      formData.append("businessField", item.value);
    }

    if (values.mitraLogo) {
      formData.append("mitraLogo", values.mitraLogo);
    }

    toast.promise(mutateAsync(formData), {
      loading: "Membuat mitra ...",
      success: () => {
        setOpen(false);
        form.reset();
        return "Membuat mitra berhasil";
      },
      error: (err) => err.message || "Gagal membuat mitra",
    });
  };

  useEffect(() => {
    return () => {
      if (previewLogo) URL.revokeObjectURL(previewLogo);
    };
  }, [previewLogo]);

  const form = useForm<CreateMitraInput>({
    resolver: zodResolver(createMitraSchema),
    defaultValues: {
      mitraName: "",
      businessField: [],
      mitraLogo: undefined,
    },
  });

  const {
    fields: businessField,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "businessField",
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <AlertDialogTrigger asChild>
        <Button size="sm">
          Tambah Mitra <PlusCircle />
        </Button>
      </AlertDialogTrigger>

      {/* Content */}
      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit">
        {/* Header */}
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Mitra</AlertDialogTitle>
          <AlertDialogDescription>Make changes here. Click save when you&apos;re done</AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />

        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
            <Controller
              name="mitraLogo"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <div className="md:col-span-2 gap-1">
                    <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start">
                      <FieldLabel htmlFor="mitraLogo">Logo Mitra</FieldLabel>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          field.onChange(file);
                          setPreviewLogo(URL.createObjectURL(file));
                        }}
                      />

                      {/* Preview */}
                      {previewLogo ? (
                        <div className="flex flex-row  items-center gap-4">
                          <div className="relative h-36 w-36 rounded-md overflow-hidden border">
                            <Image src={previewLogo} alt="user-profile" fill unoptimized className="object-contain" />
                          </div>

                          <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            Ganti Foto
                          </Button>
                        </div>
                      ) : (
                        /* Kalau belum ada profile */
                        <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
                          Upload Foto
                        </Button>
                      )}

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  </div>
                );
              }}
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

                  {/* Input add business field */}
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

                  {/* Badge list */}
                  <div className="flex flex-wrap gap-2">
                    {businessField.map((item, index) => (
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

          {/* Footer */}
          <AlertDialogFooter className="flex w-full justify-between">
            <AlertDialogCancel asChild size="sm">
              <Button
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                  setPreviewLogo(null);
                }}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Creating.." : "Create Mitra"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
