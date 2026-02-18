import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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

export function MitraAddDialog() {
  const [open, setOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

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
    fields: businessFieldFields,
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
      <AlertDialogContent className="max-h-[90vh] flex flex-col sm:max-w-3xl">
        <form onSubmit={form.handleSubmit(handleCreate)} className="flex flex-col h-full">
          {/* Header */}
          <AlertDialogHeader className="shrink-0">
            <AlertDialogTitle>Tambah Mitra</AlertDialogTitle>
            <AlertDialogDescription>Make changes here. Click save when you&apos;re done</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col flex-1 overflow-y-auto px-4 py-4 gap-4  ">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
            <Controller
              name="mitraName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="grid gap-1" data-invalid={fieldState.invalid}>
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
                <Field className="grid gap-2" data-invalid={fieldState.invalid}>
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
                  <div className="flex  gap-2">
                    {businessFieldFields.map((item, index) => (
                      <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                        {item.value}
                        <button type="button" onClick={() => remove(index)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* </div> */}
            <Controller
              name="mitraLogo"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <div className="">
                    <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start mb-2 w-fit">
                      <FieldLabel htmlFor="mitraLogo">Logo</FieldLabel>
                      <Input
                        id="mitraLogo"
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          field.onChange(file);
                          setPreviewLogo(URL.createObjectURL(file));
                        }}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      {previewLogo && (
                        <div className="flex items-center">
                          <div className="flex items-center relative h-36 w-36 rounded-md overflow-hidden border">
                            <Image src={previewLogo} alt="user-profile" fill unoptimized className="object-cover" />
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>
                );
              }}
            />
          </div>

          {/* Footer */}
          <AlertDialogFooter className="shrink-0 flex justify-between">
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
