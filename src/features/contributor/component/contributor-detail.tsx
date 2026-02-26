"use client";

import { useState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IconListDetails } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Contributor, ContributorType, UpdateContributorInput, updateContributorSchema } from "../type";
import { useUpdateContributor } from "../hook";
import { EntityDialog } from "@/components/shared/entity-dialog";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";

export function ContributorDetailDialog({ contributor }: { contributor: Contributor }) {
  const [open, setOpen] = useState(false);
  const contributorTypeOptions = Object.values(ContributorType);
  const { mutateAsync: updateContributor, isPending } = useUpdateContributor();

  const form = useForm<Omit<UpdateContributorInput, "profile">>({
    resolver: zodResolver(updateContributorSchema.omit({ profile: true })),
    defaultValues: {
      contributorName: "",
      jobTitle: "",
      companyName: "",
      expertise: [],
      contributorType: undefined,
      isDisplayed: false,
    },
  });

  const {
    fields: expertiseFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "expertise",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        contributorName: contributor.contributor_name,
        jobTitle: contributor.contributor_job_title,
        companyName: contributor.contributor_company_name,
        contributorType: contributor.contributor_type,
        expertise: contributor.contributor_expertise.map((e) => ({ value: e })),
        isDisplayed: contributor.is_displayed,
      });
    }
  }, [open, contributor, form]);
  const handleUpdate = async (values: Omit<UpdateContributorInput, "profile">) => {
    const payload = {
      contributorName: values.contributorName,
      jobTitle: values.jobTitle,
      companyName: values.companyName,
      contributorType: values.contributorType,
      expertise: values.expertise.map((item) => item.value),
      isDisplayed: values.isDisplayed,
    };

    toast.promise(
      updateContributor({
        id: contributor.contributor_id,
        data: payload,
      }),
      {
        loading: "Updating contributor...",
        success: () => {
          setOpen(false);
          return "Contributor berhasil diperbarui";
        },
        error: (err) => err.message || "Gagal memperbarui contributor",
      },
    );
  };

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Contributor Detail"
      description="Perbarui detail contributor di bawah ini"
      isPending={isPending}
      saveLabel="Update"
      onSubmit={form.handleSubmit(handleUpdate)}
      className="sm:max-w-3xl"
      trigger={
        <Button variant="outline" size="icon-sm">
          <IconListDetails />
        </Button>
      }
    >
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

      <Controller
        name="contributorName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="contributorName">Name</FieldLabel>

            <Input {...field} id="contributorName" placeholder="Masukan nama..." aria-invalid={fieldState.invalid} autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="jobTitle"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
            <Input {...field} id="jobTitle" placeholder="Masukan job title..." aria-invalid={fieldState.invalid} autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="companyName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
            <Input {...field} id="companyName" placeholder="Masukan nama perusahaan..." aria-invalid={fieldState.invalid} autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="contributorType"
        control={form.control}
        render={({ field }) => (
          <Field className="gap-1">
            <FieldLabel>Type</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tipe contributor..." />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {contributorTypeOptions.map((type) => (
                    <SelectItem value={type} key={type}>
                      {type === "INTERNAL" ? "Mentor" : "Bukan Mentor"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        name="expertise"
        control={form.control}
        render={({ fieldState }) => (
          <Field className="md:col-span-2 gap-2" data-invalid={fieldState.invalid}>
            <FieldLabel>Expertise</FieldLabel>
            <FieldDescription>Ketik expertise lalu tekan Enter</FieldDescription>
            <InputGroup>
              <InputGroupInput
                placeholder="Masukan expertise..."
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
              {expertiseFields.map((item, index) => (
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
