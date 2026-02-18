import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTestimoni } from "../hook";
import { CreateTestimoniInput, createTestimoniSchema, TestimoniType } from "../type";

export function TestimoniAddDialog() {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const testimoniCategoryOptions = Object.values(TestimoniType);

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
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <AlertDialogTrigger asChild>
        <Button size="sm">
          Tambah Testimoni <PlusCircle />
        </Button>
      </AlertDialogTrigger>

      {/* Content */}
      <AlertDialogContent className="w-[95vw] max-w-4xl! max-h-[95vh] flex flex-col">
        <form onSubmit={form.handleSubmit(handleCreate)} className="flex flex-col h-full ">
          {/* HEADER */}
          <AlertDialogHeader className="shrink-0">
            <AlertDialogTitle>Tambah Testimoni</AlertDialogTitle>
            <AlertDialogDescription>Make changes here. Click save when you are done</AlertDialogDescription>
          </AlertDialogHeader>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto py-6">
            {/* GRID 4 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              {/* ================= PROFILE (2x2) ================= */}
              <Controller
                name="authorProfile"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="md:col-span-2 md:row-span-2">
                    <FieldLabel>Profile</FieldLabel>

                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        field.onChange(file);
                        setPreviewProfile(URL.createObjectURL(file));
                      }}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                    {previewProfile && (
                      <div className="w-full max-w-sm">
                        <div className="relative h-48 w-48 rounded-lg border bg-accent overflow-hidden">
                          <Image src={previewProfile} alt="preview" fill className="object-cover" />
                        </div>
                      </div>
                    )}
                  </Field>
                )}
              />

              {/* ================= NAME ================= */}
              <Controller
                name="authorName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...field} className="w-full" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* ================= JOB TITLE ================= */}
              <Controller
                name="authorJobTitle"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
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
                  <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel>Company Name</FieldLabel>
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
                  <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose Category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {testimoniCategoryOptions.map((type) => (
                            <SelectItem value={type} key={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* ================= TESTIMONI FULL WIDTH ================= */}
              <Controller
                name="testimoniContent"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="md:col-span-6" data-invalid={fieldState.invalid}>
                    <FieldLabel>Testimoni</FieldLabel>
                    <Textarea {...field} className="w-full min-h-35" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </div>

          {/* FOOTER */}
          <AlertDialogFooter className="shrink-0 flex justify-between">
            <AlertDialogCancel
              onClick={() => {
                setPreviewProfile(null);
                setOpen(false);
                form.reset();
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
