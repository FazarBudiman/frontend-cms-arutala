"use client";

import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useCreateUser } from "../hooks";
import { CreateUserInput, createUserSchema, UserRole } from "../type";
import { EntityDialog } from "@/components/shared/entity-dialog";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";

export function UserAddDialog() {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const roleOptions = Object.values(UserRole);

  const { mutateAsync: createUser, isPending } = useCreateUser();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      userRole: UserRole.ADMIN,
      profile: undefined,
    },
  });

  const handleCreate = async (values: CreateUserInput) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("userRole", values.userRole);

    if (values.profile) {
      formData.append("Profile", values.profile);
    }

    toast.promise(createUser(formData), {
      loading: "Membuat user...",
      success: () => {
        setOpen(false);
        form.reset();
        setPreviewProfile(null);
        return "User berhasil dibuat";
      },
      error: (err) => err.message || "Gagal membuat user",
    });
  };

  useEffect(() => {
    return () => {
      if (previewProfile) URL.revokeObjectURL(previewProfile);
    };
  }, [previewProfile]);

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Tambah User"
      description="Isi detail user di bawah ini"
      isPending={isPending}
      saveLabel="Create User"
      onSubmit={form.handleSubmit(handleCreate)}
      className="sm:max-w-3xl"
      trigger={
        <Button size="sm">
          Tambah User <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
        <Controller
          name="profile"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="md:col-span-2">
              <Field data-invalid={fieldState.invalid} orientation="horizontal" className="grid grid-cols-1 md:grid-cols-[1fr,160px] gap-2 items-start">
                <FieldLabel htmlFor="profile">Profile</FieldLabel>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    field.onChange(file);
                    if (previewProfile) URL.revokeObjectURL(previewProfile);
                    setPreviewProfile(URL.createObjectURL(file));
                  }}
                />
                <div className="flex flex-row items-center gap-4">
                  {previewProfile ? (
                    <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                      <Image src={previewProfile} alt="user-profile" fill unoptimized className="object-contain" />
                    </div>
                  ) : null}
                  <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    {previewProfile ? "Ganti Foto" : "Upload Foto"}
                  </Button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            </div>
          )}
        />

        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
              <Input {...field} id="full-name" aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input {...field} id="username" aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input {...field} id="password" type="password" aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input {...field} id="confirm-password" type="password" aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="userRole"
          control={form.control}
          render={({ field }) => (
            <Field className="gap-1">
              <FieldLabel>Role</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {roleOptions.map((role) => (
                      <SelectItem value={role} key={role}>
                        {formatSnakeCaseToTitle(role)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </div>
    </EntityDialog>
  );
}
