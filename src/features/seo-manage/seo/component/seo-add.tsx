import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateSeo } from "../hook";
import { SeoInput, seoInputSchema } from "../type";
import { PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { EntityDialog } from "@/components/shared/entity-dialog";

export function SeoAddDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateSeo();
  const params = useParams();
  const pageId = params.pageId as string;

  const handleSubmit = async (values: SeoInput) => {
    toast.promise(mutateAsync({ pageId: pageId, body: values }), {
      loading: "Menambah SEO pada Page...",
      success: () => "Menambah SEO berhasil",
      error: (err) => err.message || "Failed to add SEO",
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
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Add Seo in This Page"
      description="Make changes here. Click save when you're done"
      isPending={isPending}
      saveLabel="Create"
      onSubmit={form.handleSubmit(handleSubmit)}
      trigger={
        <Button size="sm">
          Tambah SEO <PlusCircle />
        </Button>
      }
    >
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
    </EntityDialog>
  );
}
