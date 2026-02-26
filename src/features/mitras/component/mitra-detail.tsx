"use client";

import { useState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { IconListDetails } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { UpdateMitraInput, Mitra, updateMitraSchema } from "../type";
import { useUpdateMitra } from "../hook";
import { EntityDialog } from "@/components/shared/entity-dialog";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";

export function MitraDetailDialog({ mitra }: { mitra: Mitra }) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: updateMitra, isPending } = useUpdateMitra();

  const form = useForm<Omit<UpdateMitraInput, "mitraLogo">>({
    resolver: zodResolver(updateMitraSchema.omit({ mitraLogo: true })),
    defaultValues: {
      mitraName: "",
      businessField: [],
      isDisplayed: false,
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

        isDisplayed: mitra.is_displayed,
      });
    }
  }, [open, mitra, form]);

  const handleUpdate = async (values: UpdateMitraInput) => {
    // Only send metadata as JSON
    const payload = {
      mitraName: values.mitraName,
      businessField: values.businessField.map((f) => f.value),
      isDisplayed: values.isDisplayed,
    };

    toast.promise(
      updateMitra({
        id: mitra.mitra_id,
        data: payload,
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
      <div className="md:col-span-2 flex">
        {/* Status */}
        <Controller
          name="isDisplayed"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="isDisplayed">Status</FieldLabel>
              <Switch className="mt-2" id="isDisplayed" checked={field.value} onCheckedChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Name */}
        <Controller
          name="mitraName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="mitraName">Name</FieldLabel>
              <Input {...field} id="mitraName" placeholder="Masukan nama mitra..." aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* Business Field */}
      <Controller
        name="businessField"
        control={form.control}
        render={({ fieldState }) => (
          <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel>Business Field</FieldLabel>
            <FieldDescription>Ketik business field lalu tekan Enter</FieldDescription>
            <InputGroup>
              <InputGroupInput
                placeholder="Masukan business field..."
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
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="secondary"
                  onClick={(e, value) => {
                    e.preventDefault();
                    const trimmedValue = value.trim();
                    if (!trimmedValue) return;
                    append({ value: trimmedValue });
                    const input = e.currentTarget.closest('[data-slot="input-group"]')?.querySelector("input");
                    if (input) input.value = "";
                  }}
                >
                  <IconPlus />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            <div className="flex flex-wrap gap-2 mt-2">
              {businessFields.map((item, index) => (
                <Badge key={item.id} variant="outline" className="flex items-center gap-1.5">
                  {item.value}
                  <button type="button" onClick={() => remove(index)} className="rounded-full hover:bg-muted p-0.5">
                    <IconX className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </Field>
        )}
      />
    </EntityDialog>
  );
}
