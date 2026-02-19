import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { useCreateUser } from "../hooks";
import { CreateUserInput, createUserSchema, UserRole } from "../type";
import { Separator } from "@/components/ui/separator";

export function UserAddDialog() {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const roleOptions = Object.values(UserRole);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useCreateUser();

  const handleCreate = async (values: CreateUserInput) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("userRole", values.userRole);

    if (values.profile) {
      formData.append("Profile", values.profile);
    }

    toast.promise(mutateAsync(formData), {
      loading: "Membuat user…",
      success: () => {
        setOpen(false);
        form.reset();
        return "Membuat user berhasil";
      },
      error: (err) => err.message || "Gagal membuat user",
    });
  };

  useEffect(() => {
    return () => {
      if (previewProfile) URL.revokeObjectURL(previewProfile);
    };
  }, [previewProfile]);

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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <AlertDialogTrigger asChild>
        <Button size="sm">
          Tambah User <PlusCircle />
        </Button>
      </AlertDialogTrigger>

      {/* Content */}
      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit">
        {/* Header */}
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah User</AlertDialogTitle>
          <AlertDialogDescription>Make changes here. Click save when you&apos;re done</AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />

        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
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
                  <Input {...field} id="password" aria-invalid={fieldState.invalid} autoComplete="off" />
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
                  <Input {...field} id="confirm-password" aria-invalid={fieldState.invalid} autoComplete="off" />
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
                            {role}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                  form.reset();
                  setPreviewProfile(null);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Creating.." : "Create User"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
