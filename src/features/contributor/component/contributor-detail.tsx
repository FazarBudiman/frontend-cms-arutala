import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Image from "next/image";
import { IconListDetails } from "@tabler/icons-react";
import { toast } from "sonner";
import { Contributor, ContributorType, UpdateContributorInput, updateContributorSchema } from "../type";
import { useUpdateContributor } from "../hook";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ContributorDetailDialog({ contributor }: { contributor: Contributor }) {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(contributor.contributor_profile_url);
  const contributorTypeOptions = Object.values(ContributorType);
  const { mutateAsync, isPending } = useUpdateContributor();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpdate = async (values: UpdateContributorInput) => {
    const formData = new FormData();
    formData.append("contributorName", values.contributorName);
    formData.append("jobTitle", values.jobTitle);
    formData.append("companyName", values.companyName);
    formData.append("contributorType", values.contributorType);

    values.expertise.forEach((item) => {
      formData.append("expertise", item.value);
    });

    if (values.profile) {
      formData.append("profile", values.profile);
    }

    toast.promise(
      mutateAsync({
        id: contributor.contributor_id,
        data: formData,
      }),
      {
        loading: "Updating contributor...",
        success: () => "Mengubah contributor berhasil",
        error: (err) => {
          return err.message || "Failed to update contributor";
        },
      },
    );
    setOpen(false);
  };

  const form = useForm<UpdateContributorInput>({
    resolver: zodResolver(updateContributorSchema),
    defaultValues: {
      contributorName: "",
      jobTitle: "",
      companyName: "",
      expertise: [],
      profile: undefined,
      contributorType: undefined,
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
        profile: undefined,
      });
    }
  }, [open, contributor, form]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <IconListDetails />
        </Button>
      </AlertDialogTrigger>

      {/* Content */}
      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit">
        {/* Header */}
        <AlertDialogHeader className="shrink-0">
          <AlertDialogTitle>Contributor Detail</AlertDialogTitle>
          <AlertDialogDescription>Make changes here. Click save when you&apos;re done</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
            <Controller
              name="profile"
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

            <Controller
              name="contributorName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className=" gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contributorName">Name</FieldLabel>
                  <Input {...field} id="contributorName" aria-invalid={fieldState.invalid} autoComplete="off" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="jobTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className=" gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
                  <Input {...field} id="jobTitle" aria-invalid={fieldState.invalid} autoComplete="off" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="companyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className=" gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                  <Input {...field} id="companyName" aria-invalid={fieldState.invalid} autoComplete="off" />
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
                      <SelectValue placeholder="Choose Type" />
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

                  {/* Input add expertise */}
                  <Input
                    placeholder="Ketik expertise lalu Enter"
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
                  <div className="flex flex-wrap gap-2">
                    {expertiseFields.map((item, index) => (
                      <Badge key={item.id} variant="outline" className="flex items-center gap-1.5">
                        {item.value}
                        <button type="button" onClick={() => remove(index)} className="rounded-full hover:bg-muted p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {/* Footer */}
          <AlertDialogFooter className="flex w-full justify-between">
            <AlertDialogCancel asChild size="sm">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
