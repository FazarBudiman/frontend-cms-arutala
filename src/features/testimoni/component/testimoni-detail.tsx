import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconListDetails } from "@tabler/icons-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Testimoni, TestimoniType, UpdateTestimoniInput, updateTestimoniSchema } from "../type";
import { useUpdateTestimoni } from "../hook";
import { EntityDialog } from "@/components/shared/entity-dialog";
import { Switch } from "@/components/ui/switch";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";

export function TestimoniDetailDialog({ testimoni }: { testimoni: Testimoni }) {
  const [open, setOpen] = useState(false);
  const testimoniCategoryOptions = Object.values(TestimoniType);
  const { mutateAsync, isPending } = useUpdateTestimoni();

  const handleUpdate = async (values: Omit<UpdateTestimoniInput, "authorProfile">) => {
    const payload = {
      authorName: values.authorName,
      authorJobTitle: values.authorJobTitle,
      authorCompanyName: values.authorCompanyName,
      testimoniCategory: values.testimoniCategory,
      testimoniContent: values.testimoniContent,
      isDisplayed: values.isDisplayed,
    };

    toast.promise(
      mutateAsync({
        id: testimoni.testimoni_id,
        data: payload,
      }),
      {
        loading: "Updating testimoni...",
        success: "Mengubah testimoni berhasil",
        error: (err) => {
          return err.message || "Failed to update testimoni";
        },
      },
    );

    setOpen(false);
  };

  const form = useForm<Omit<UpdateTestimoniInput, "authorProfile">>({
    resolver: zodResolver(updateTestimoniSchema.omit({ authorProfile: true })),
    defaultValues: {
      authorName: "",
      authorJobTitle: "",
      authorCompanyName: "",
      testimoniContent: "",
      isDisplayed: false,
      testimoniCategory: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        authorName: testimoni.author_name,
        authorJobTitle: testimoni.author_job_title,
        authorCompanyName: testimoni.author_company_name,
        testimoniContent: testimoni.testimoni_content,
        testimoniCategory: testimoni.testimoni_category,
        isDisplayed: testimoni.is_displayed,
      });
    }
  }, [open, testimoni, form]);

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Testimoni Detail"
      description="Perbarui detail testimoni di bawah ini"
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
      <Controller
        name="authorName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="authorName">Name</FieldLabel>
            <Input {...field} id="authorName" placeholder="Masukan nama..." aria-invalid={fieldState.invalid} autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="testimoniCategory"
        control={form.control}
        render={({ field }) => (
          <Field className="gap-1">
            <FieldLabel>Category</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori testimoni..." />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {testimoniCategoryOptions.map((category) => (
                    <SelectItem value={category} key={category}>
                      {formatSnakeCaseToTitle(category)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Controller
        name="authorJobTitle"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="authorJobTitle">Job Title</FieldLabel>
            <Input {...field} id="authorJobTitle" placeholder="Masukan job title..." aria-invalid={fieldState.invalid} autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="authorCompanyName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="authorCompanyName">Company Name</FieldLabel>
            <Input {...field} id="authorCompanyName" placeholder="Masukan nama perusahaan..." aria-invalid={fieldState.invalid} autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="testimoniContent"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="testimoniContent">Testimoni</FieldLabel>
            <Textarea {...field} id="testimoniContent" placeholder="Masukan konten testimoni..." aria-invalid={fieldState.invalid} autoComplete="off" className="w-full min-h-20" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </EntityDialog>
  );
}
