import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { CreateUserInput, createUserSchema, USER_ROLES } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@/hooks/use-user";
import Image from "next/image";

export function UserAddSheet() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const roleOptions = Object.values(USER_ROLES);

  const { mutateAsync, isPending } = useCreateUser();

  const handleSheetChange = (open: boolean) => {
    setSheetOpen(open);

    if (!open) {
      form.reset();
      setPreviewProfile(null);
    }
  };

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      userRole: USER_ROLES.ADMIN,
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

    toast.promise(mutateAsync(formData), {
      loading: "Membuat user…",
      success: (res) => {
        if (!res.success) throw new Error(res.message);
        setSheetOpen(false);
        return res.message;
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
    <Sheet open={sheetOpen} onOpenChange={handleSheetChange}>
      <SheetTrigger asChild>
        <Button size="sm">
          Tambah User <PlusCircle />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-120">
        <form onSubmit={form.handleSubmit(handleCreate)}>
          <SheetHeader>
            <SheetTitle>Add User</SheetTitle>
            <SheetDescription>Create a new User here. Click create when you&apos;re done</SheetDescription>
          </SheetHeader>

          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <FieldGroup>
              <Controller
                name="profile"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="grid gap-3" data-invalid={fieldState.invalid}>
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
                    {previewProfile && (
                      <div className="flex items-center">
                        <div className="flex items-center relative h-36 w-36 rounded-md overflow-hidden border">
                          <Image src={previewProfile} alt="user-profile" fill unoptimized className="object-cover" />
                        </div>
                      </div>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="grid gap-3" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-3" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-3" data-invalid={fieldState.invalid}>
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
                  <Field className="grid gap-3" data-invalid={fieldState.invalid}>
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
                  <Field>
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
            </FieldGroup>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSheetOpen(false);
                }}
              >
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
