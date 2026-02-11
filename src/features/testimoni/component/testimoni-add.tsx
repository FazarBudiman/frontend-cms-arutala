import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button size="sm">
          Tambah Testimoni <PlusCircle />
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="max-h-[120vh] flex flex-col sm:max-w-3xl">
        <form onSubmit={form.handleSubmit(handleCreate)} className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="shrink-0">
            <DialogTitle>Tambah Testimoni</DialogTitle>
            <DialogDescription>Make changes here. Click save when you&apos;re done</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 ">
            <Controller
              name="authorProfile"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <div className="">
                    <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] items-start w-fit">
                      <FieldLabel htmlFor="profile">Profile</FieldLabel>
                      <Input
                        id="profile"
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          field.onChange(file);
                          setPreviewProfile(URL.createObjectURL(file));
                        }}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      {previewProfile && (
                        <div className="w-full p-2 max-w-sm ">
                          <AspectRatio ratio={4 / 2} className="bg-accent rounded-lg border">
                            <Image src={previewProfile} alt="testimoni-profile" fill className="object-contain p-2" />
                          </AspectRatio>
                        </div>
                      )}
                    </Field>
                  </div>
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Controller
                name="authorName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="authorName">Name</FieldLabel>
                    <Input {...field} id="authorName" aria-invalid={fieldState.invalid} autoComplete="off" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="authorJobTitle"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="authorCompanyName">Company Name</FieldLabel>
                    <Input {...field} id="authorCompanyName" aria-invalid={fieldState.invalid} autoComplete="off" />
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
                  </Field>
                )}
              />
            </div>
            <Controller
              name="testimoniContent"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="grid gap-1 h-16" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="testimoniContent">Testimoni</FieldLabel>
                  <Textarea {...field} id="testimoniContent" aria-invalid={fieldState.invalid} autoComplete="off" />
                  {/* <Input {...field} id="testimoniContent" aria-invalid={fieldState.invalid} autoComplete="off" /> */}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
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
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
