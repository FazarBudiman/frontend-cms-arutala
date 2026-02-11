import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, X } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ContributorType, CreateContributorInput, createContributorSchema } from "../type";
import { useCreateContributor } from "../hook";

export function ContributorAddDialog() {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const contributorTypeOptions = Object.values(ContributorType);

  const { mutateAsync, isPending } = useCreateContributor();

  const handleCreate = async (values: CreateContributorInput) => {
    const formData = new FormData();
    formData.append("contributorName", values.contributorName);
    formData.append("jobTitle", values.jobTitle);
    formData.append("companyName", values.companyName);
    formData.append("contributorType", values.contributorType);

    for (const item of values.expertise) {
      formData.append("expertise", item.value);
    }

    if (values.profile) {
      formData.append("profile", values.profile);
    }

    toast.promise(mutateAsync(formData), {
      loading: "Membuat contributors ...",
      success: () => {
        setOpen(false);
        return "Membuat contributor berhasil";
      },
      error: (err) => err.message || "Gagal membuat contributors",
    });
  };

  useEffect(() => {
    return () => {
      if (previewProfile) URL.revokeObjectURL(previewProfile);
    };
  }, [previewProfile]);

  const form = useForm<CreateContributorInput>({
    resolver: zodResolver(createContributorSchema),
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button size="sm">
          Tambah Contributor <PlusCircle />
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="max-h-[90vh] flex flex-col sm:max-w-3xl">
        <form onSubmit={form.handleSubmit(handleCreate)} className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="shrink-0">
            <DialogTitle>Tambah Contributor</DialogTitle>
            <DialogDescription>Make changes here. Click save when you&apos;re done</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 gap-4  ">
            <Controller
              name="profile"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="contributorName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                    <Input {...field} id="companyName" aria-invalid={fieldState.invalid} autoComplete="off" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* <Controller
                name="expertise"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="expertise">Expertise</FieldLabel>
                    <Input {...field} id="expertise" aria-invalid={fieldState.invalid} autoComplete="off" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              /> */}
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
                      <SelectContent>
                        <SelectGroup>
                          {contributorTypeOptions.map((type) => (
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
                name="expertise"
                control={form.control}
                render={({ fieldState }) => (
                  <Field className="grid gap-2" data-invalid={fieldState.invalid}>
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
            </div>
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
