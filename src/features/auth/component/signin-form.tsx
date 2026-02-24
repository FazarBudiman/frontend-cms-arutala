"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "../api";
import { SignInInput, signInSchema } from "../schema";

export function SignInForm() {
  const router = useRouter();

  const [passwordCheck, setPasswordCheck] = useState(false);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;

  const handleSignIn = async (values: SignInInput) => {
    toast.promise(loginAction(values), {
      loading: "Sign in...",
      success: () => {
        router.push("/general/dashboard");
        return "Sign In Berhasil";
      },
      error: (err) => err.message,
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login with your Arutala CMS account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(handleSignIn)}>
          <FieldGroup>
            {/* Username */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input {...field} id="username" autoComplete="off" aria-invalid={fieldState.invalid} disabled={isSubmitting} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} id="password" aria-invalid={fieldState.invalid} type={passwordCheck ? "text" : "password"} disabled={isSubmitting} />
                    <InputGroupAddon className=" cursor-pointer" align="inline-end" onClick={() => setPasswordCheck(!passwordCheck)}>
                      {passwordCheck ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Button type="submit">{isSubmitting ? "Loading..." : "Sign In"}</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
