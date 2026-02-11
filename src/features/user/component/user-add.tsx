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
import { useCreateUser } from "../hooks";
import { CreateUserInput, createUserSchema, UserRole } from "../type";

export function UserAddDialog() {
  const [open, setOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const roleOptions = Object.values(UserRole);

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
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button size="sm">
          Tambah User <PlusCircle />
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="max-h-[90vh] flex flex-col sm:max-w-3xl">
        <form onSubmit={form.handleSubmit(handleCreate)} className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="shrink-0">
            <DialogTitle>Tambah User</DialogTitle>
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
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-1" data-invalid={fieldState.invalid}>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
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
