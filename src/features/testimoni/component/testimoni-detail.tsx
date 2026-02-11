import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { IconListDetails } from "@tabler/icons-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { CreateTestimoniInput, createTestimoniSchema, Testimoni, TestimoniType } from "../type";
import { useUpdateTestimoni } from "../hook";

export function TestimoniDetailDialog({ testimoni }: { testimoni: Testimoni }) {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(testimoni.author_profile_url);
  const testimoniCategoryOptions = Object.values(TestimoniType);
  const { mutateAsync, isPending } = useUpdateTestimoni();

  const handleUpdate = async (values: CreateTestimoniInput) => {
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
        success: "Mengubah contributot berhasil",
        error: (err) => {
          return err.message || "Failed to update contributor";
        },
      },
    );

    setOpen(false);
  };

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
      // setPreviewProfile(contributor.contributor_profile_url);
    }
  }, [open, testimoni, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <IconListDetails />
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="max-h-[90vh] flex flex-col sm:max-w-3xl">
        <form onSubmit={form.handleSubmit(handleUpdate)} className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="shrink-0">
            <DialogTitle>Testimpni Detail</DialogTitle>
            <DialogDescription>Make changes here. Click save when you&apos;re done</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 gap-4  ">
            <Controller
              name="authorProfile"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <div className="">
                    <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start mb-2 w-fit">
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
                        <div className="flex items-center">
                          <div className="flex items-center relative h-36 w-36 rounded-md overflow-hidden border">
                            <Image src={previewProfile} alt="user-profile" fill unoptimized className="object-cover" />
                          </div>
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
