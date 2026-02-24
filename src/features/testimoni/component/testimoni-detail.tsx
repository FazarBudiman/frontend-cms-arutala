import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { IconListDetails } from "@tabler/icons-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Testimoni, TestimoniType, UpdateTestimoniInput, updateTestimoniSchema } from "../type";
import { useUpdateTestimoni } from "../hook";
import { EntityDialog } from "@/components/shared/entity-dialog";

export function TestimoniDetailDialog({ testimoni }: { testimoni: Testimoni }) {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(testimoni.author_profile_url);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const testimoniCategoryOptions = Object.values(TestimoniType);
  const { mutateAsync, isPending } = useUpdateTestimoni();

  const handleUpdate = async (values: UpdateTestimoniInput) => {
    const formData = new FormData();
    formData.append("authorName", values.authorName);
    formData.append("authorJobTitle", values.authorJobTitle);
    formData.append("authorCompanyName", values.authorCompanyName);
    formData.append("testimoniCategory", values.testimoniCategory);
    formData.append("testimoniContent", values.testimoniContent);

    if (values.authorProfile) {
      formData.append("profile", values.authorProfile);
    }

    toast.promise(
      mutateAsync({
        id: testimoni.testimoni_id,
        data: formData,
      }),
      {
        loading: "Updating contributor...",
        success: "Mengubah contributor berhasil",
        error: (err) => {
          return err.message || "Failed to update contributor";
        },
      },
    );

    setOpen(false);
  };

  const form = useForm<UpdateTestimoniInput>({
    resolver: zodResolver(updateTestimoniSchema),
    defaultValues: {
      authorName: "",
      authorJobTitle: "",
      authorCompanyName: "",
      testimoniContent: "",
      testimoniCategory: undefined,
      authorProfile: undefined,
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
        authorProfile: undefined,
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
      <Controller
        name="authorProfile"
        control={form.control}
        render={({ field, fieldState }) => {
          return (
            <div className="md:col-span-2 gap-1">
              <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start">
                <FieldLabel htmlFor="profile">Profile</FieldLabel>

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
                    setPreviewProfile(URL.createObjectURL(file));
                  }}
                />

                {/* Preview */}
                {previewProfile ? (
                  <div className="flex flex-row  items-center gap-4">
                    <div className="relative h-36 w-36 rounded-md overflow-hidden border">
                      <Image src={previewProfile} alt="user-profile" fill unoptimized className="object-contain" />
                    </div>

                    {/* <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            Ganti Foto
                          </Button> */}
                  </div>
                ) : (
                  <span></span>
                  /* Kalau belum ada profile */
                  // <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
                  //   Upload Foto
                  // </Button>
                )}

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            </div>
          );
        }}
      />

      <Controller
        name="authorName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="authorName">Name</FieldLabel>
            <Input {...field} id="authorName" aria-invalid={fieldState.invalid} autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="testimoniCategory"
        control={form.control}
        render={({ field }) => (
          <Field className="gap-1">
            <FieldLabel>Type</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {testimoniCategoryOptions.map((type) => (
                    <SelectItem value={type} key={type}>
                      {type}
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
            <Input {...field} id="authorJobTitle" aria-invalid={fieldState.invalid} autoComplete="off" />
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
            <Input {...field} id="authorCompanyName" aria-invalid={fieldState.invalid} autoComplete="off" />
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
            <Textarea {...field} id="testimoniContent" aria-invalid={fieldState.invalid} autoComplete="off" className="w-full min-h-20" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </EntityDialog>
  );
}
