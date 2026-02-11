import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Image from "next/image";
import { IconListDetails } from "@tabler/icons-react";
import { toast } from "sonner";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CreateMitraInput, createMitraSchema, Mitra } from "../type";
import { useUpdateMitra } from "../hook";

export function MitraDetailDialog({ mitra }: { mitra: Mitra }) {
  const [open, setOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(mitra.mitra_logo_url);
  const { mutateAsync, isPending } = useUpdateMitra();

  const handleUpdate = async (values: CreateMitraInput) => {
    const formData = new FormData();

    formData.append("mitraName", values.mitraName);

    values.businessField.forEach((item) => {
      formData.append("businessField", item.value);
    });

    if (values.mitraLogo) {
      formData.append("mitraLogo", values.mitraLogo);
    }

    toast.promise(
      mutateAsync({
        id: mitra.mitra_id,
        data: formData,
      }),
      {
        loading: "Updating mitra...",
        success: "Mengubah Mitra berhasil",
        error: (err) => {
          return err.message || "Failed to update mitra";
        },
      },
    );

    setOpen(false);
  };

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

  useEffect(() => {
    if (open) {
      form.reset({
        mitraName: mitra.mitra_name,
        businessField: mitra.business_field.map((e) => ({ value: e })),
        mitraLogo: undefined,
      });
      // setPreviewProfile(contributor.contributor_profile_url);
    }
  }, [open, mitra, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button size="icon-sm">
          <IconListDetails />
        </Button>
        {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()}></DropdownMenuItem> */}
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="max-h-[90vh] flex flex-col sm:max-w-3xl">
        <form onSubmit={form.handleSubmit(handleUpdate)} className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="shrink-0">
            <DialogTitle>Mitra Detail</DialogTitle>
            <DialogDescription>Make changes here. Click save when you&apos;re done</DialogDescription>
          </DialogHeader>

          {/* Detail */}
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
                    {businessField.map((item, index) => (
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
                          <AspectRatio ratio={4 / 2} className="bg-accent rounded-lg border">
                            <Image src={previewLogo} alt={field.name} fill className="object-contain p-2" />
                          </AspectRatio>
                        </div>
                      )}
                    </Field>
                  </div>
                );
              }}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="shrink-0 flex justify-between">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
            {/* <Button type="submit" disabled={isPending}>
              Create
            </Button> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
