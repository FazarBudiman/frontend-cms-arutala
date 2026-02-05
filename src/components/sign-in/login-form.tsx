"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, type AuthState } from "@/app/sign-in/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Loading..." : "Login"}
    </Button>
  );
}

export function SignInForm() {
  const router = useRouter();

  const [state, action] = useActionState<AuthState, FormData>(loginAction, {});

  // kalau tidak ada error → login sukses
  useEffect(() => {
    if (!state.error) return;

    // error ada → stay di form
  }, [state]);

  useEffect(() => {
    if (state && !state.error) {
      router.push("/general/dashboard");
      router.refresh();
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login with your Arutala CMS account</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action}>
          <FieldGroup>
            {state.error && <div className="bg-destructive/15 text-destructive rounded-md px-4 py-3 text-sm">{state.error}</div>}

            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" name="username" required autoComplete="username" />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </Field>

            <SubmitButton />
          </FieldGroup>
        </form>
      </CardContent>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </Card>
  );
}
