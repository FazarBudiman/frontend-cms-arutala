import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useCreateSeo } from "../hook";
import { SeoInput, seoInputSchema } from "../type";
import { PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";

export function SeoAddlDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateSeo();
  const params = useParams();
  const pageId = params.pageId as string;

  const handleSubmit = async (values: SeoInput) => {
    toast.promise(mutateAsync({ pageId: pageId, body: values }), {
      loading: "Menambah SEO pada Page...",
      success: () => "Menambah SEO berhasil",
      error: (err) => {
        return err.message || "Failed to update contributor";
      },
    });
    setOpen(false);
  };

  const form = useForm<SeoInput>({
    resolver: zodResolver(seoInputSchema),
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <AlertDialogTrigger asChild>
        <Button size="sm">
          Tambah SEO <PlusCircle />
        </Button>
      </AlertDialogTrigger>

      {/* Content */}
      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit">
        {/* Header */}
        <AlertDialogHeader className="shrink-0">
          <AlertDialogTitle>Add Seo in This Page</AlertDialogTitle>
          <AlertDialogDescription>Make changes here. Click save when you&apos;re done</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
            <Controller
              name="metaTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="metaTitle">Meta Title</FieldLabel>
                  <Input {...field} id="metaTitle" aria-invalid={fieldState.invalid} autoComplete="off" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="metaDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
                  <Textarea {...field} id="metaDescription" aria-invalid={fieldState.invalid} autoComplete="off" className="min-h-20" />
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
              {isPending ? "Creating..." : "Create"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
