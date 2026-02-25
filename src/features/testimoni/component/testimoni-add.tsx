import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTestimoni } from "../hook";
import { CreateTestimoniInput, createTestimoniSchema, TestimoniType } from "../type";
import { EntityDialog } from "@/components/shared/entity-dialog";

export function TestimoniAddDialog() {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const testimoniCategoryOptions = Object.values(TestimoniType);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useCreateTestimoni();

  const handleCreate = async (values: CreateTestimoniInput) => {
    const formData = new FormData();
    formData.append("authorName", values.authorName);
    formData.append("authorJobTitle", values.authorJobTitle);
    formData.append("authorCompanyName", values.authorCompanyName);
    formData.append("testimoniContent", values.testimoniContent);
    formData.append("testimoniCategory", values.testimoniCategory);

    if (values.authorProfile) {
      formData.append("authorProfile", values.authorProfile);
    }

    toast.promise(mutateAsync(formData), {
      loading: "Membuat testimoni ...",
      success: () => {
        setOpen(false);
        form.reset();
        return "Membuat testimoni berhasil";
      },
      error: (err) => err.message || "Gagal membuat testimoni",
    });
  };

  useEffect(() => {
    return () => {
      if (previewProfile) URL.revokeObjectURL(previewProfile);
    };
  }, [previewProfile]);

  const form = useForm<CreateTestimoniInput>({
    resolver: zodResolver(createTestimoniSchema),
    defaultValues: {
      authorName: "",
      authorJobTitle: "",
      authorCompanyName: "",
      testimoniContent: "",
      testimoniCategory: undefined,
      authorProfile: undefined,
    },
  });

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Tambah Testimoni"
      description="Isi detail testimoni di bawah ini"
      isPending={isPending}
      saveLabel="Create Testimoni"
      onSubmit={form.handleSubmit(handleCreate)}
      className="sm:max-w-3xl"
      trigger={
        <Button size="sm">
          Tambah Testimoni <PlusCircle />
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

      {/* ================= AUTHOR NAME ================= */}
      <Controller
        name="authorName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel>Name</FieldLabel>
            <Input {...field} className="w-full" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* ================= CATEGORY ================= */}
      <Controller
        name="testimoniCategory"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel>Category</FieldLabel>

            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Category" />
              </SelectTrigger>

              <SelectContent position="popper">
                <SelectGroup>
                  {testimoniCategoryOptions.map((type) => (
                    <SelectItem value={type} key={type}>
                      {type === "SISWA" ? "Siswa" : "Talent"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* ================= JOB TITLE ================= */}
      <Controller
        name="authorJobTitle"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel>Job Title</FieldLabel>
            <Input {...field} className="w-full" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* ================= COMPANY ================= */}
      <Controller
        name="authorCompanyName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel>Company Name</FieldLabel>
            <Input {...field} className="w-full" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* ================= TESTIMONI FULL WIDTH ================= */}
      <Controller
        name="testimoniContent"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel>Testimoni</FieldLabel>
            <Textarea {...field} className="w-full min-h-20" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </EntityDialog>
  );
}
