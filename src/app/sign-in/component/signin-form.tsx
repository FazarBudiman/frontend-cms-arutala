/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction, type AuthState } from "@/app/sign-in/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { SignInInput, signInSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/api";

// function SubmitButton() {
//   const { pending } = useFormStatus();

//   return (
//     <Button type="submit" className="w-full" disabled={pending}>
//       {pending ? "Loading..." : "Login"}
//     </Button>
//   );
// }

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
    try {
      await toast.promise(
        async () => {
          const result = await loginAction(values);
          if (!result.success) {
            throw new Error(result.message);
          }
          router.push("/general/dashboard");
          return result;
        },
        {
          loading: "Sign in...",
          success: (data: any) => data.message || "Sign In Berhasil",
          error: (err) => err.message,
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  // const [state, action] = useActionState<AuthState, FormData>(loginAction, {});

  // useEffect(() => {
  //   if (!state) return;

  //   if (state.success === false) {
  //     toast.error(state.message);
  //   }

  //   if (state.success === true) {
  //     toast.success(state.message);
  //     router.push("/general/dashboard");
  //   }
  // }, [state, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login with your Arutala CMS account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(handleSignIn)}>
          <FieldGroup>
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

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} id="password" aria-invalid={fieldState.invalid} type={passwordCheck ? "text" : "password"} disabled={isSubmitting} />
                    <InputGroupButton onClick={() => setPasswordCheck(!passwordCheck)}>{passwordCheck ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}</InputGroupButton>
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
